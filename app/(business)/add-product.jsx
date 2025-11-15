// app/(bussines)/AddProductScreen.jsx
import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  StyleSheet,
  Alert,
  Platform,
  ScrollView,
} from "react-native";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig"; // ⬅️ VETËM db, JO storage
import { useAuth } from "../components/AuthProvider";
import { useRouter } from "expo-router";

import Header from "../components/HeaderAdd";
import ProductForm from "../components/ProductForm";
import ProfileIcon from "../components/ProfileIcon";

const GREEN = "#2E5E2D";
const CONTENT_MAX_WIDTH = 560;

export default function AddProductScreen() {
  const { user } = useAuth();
  const router = useRouter();

  const [loading, setLoading] = useState(false);

const handleAdd = async (data) => {
  console.log("🟡 handleAdd called with:", {
    ...data,
    imageBase64: data.imageBase64
      ? `length: ${data.imageBase64.length}`
      : null,
  });

  if (!user) {
    Alert.alert("Error", "You must be logged in as a business.");
    return;
  }

  const { productName, category, price, description, imageBase64 } = data;

  if (!productName || !price) {
    Alert.alert("Error", "Name and price are required.");
    return;
  }

  const numeric = Number(price);
  if (isNaN(numeric)) {
    Alert.alert("Error", "Price must be a number.");
    return;
  }

  // 🔥 mbrojtje extra: mos lejo më shumë se ~600k karaktere
  if (imageBase64 && imageBase64.length > 600000) {
    Alert.alert(
      "Image too large",
      `The selected image is too large (${imageBase64.length} chars). Please pick a smaller image or a screenshot.`
    );
    return;
  }

  try {
    setLoading(true);

    await addDoc(collection(db, "products"), {
      name: productName,
      category: category || "All",
      price: numeric,
      description: description || "",
      imageBase64: imageBase64 || null,
      ownerId: user.uid,
      ownerEmail: user.email,
      ownerName: user.displayName || "Business",
      createdAt: new Date().toISOString(),
    });

    console.log("✅ Product added successfully");
    Alert.alert("Success", "Product posted successfully ✅");
    router.back();
  } catch (e) {
    console.log("❌ Add product error:", e);
    Alert.alert("Error", "Failed to add product.");
  } finally {
    setLoading(false);
  }
};


  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.headerRow}>
        <Header />
        <ProfileIcon onPress={() => console.log("Profile clicked")} />
      </View>

      {Platform.OS === "web" ? (
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View style={styles.formWrapper}>
            <ProductForm onSubmit={handleAdd} loading={loading} />
          </View>
        </ScrollView>
      ) : (
        <View style={styles.formWrapper}>
          <ProductForm onSubmit={handleAdd} loading={loading} />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#d7ceb2ff",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: GREEN,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    paddingHorizontal: 20,
    height: 80,
  },
  formWrapper: {
    flex: 1,
    margin: 20,
    maxWidth: CONTENT_MAX_WIDTH,
    alignSelf: "center",
    padding: Platform.select({ web: 24, default: 20 }),
    backgroundColor: "#dedbcfff",
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    width: "100%",
  },
});
