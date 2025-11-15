// app/components/ProductForm.jsx
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";

export default function ProductForm({ onSubmit, loading }) {
  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);

  const [selected, setSelected] = useState("All");
  const [open, setOpen] = useState(false);
  const categories = ["All", "Accessories", "Clothes", "Art", "Other"];

  const handlePickImage = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== "granted") {
        Alert.alert("Permission needed", "Enable gallery permission.");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
        base64: false,
      });

      if (!result.canceled) {
        const asset = result.assets[0];
        console.log("📷 original asset:", asset);

        // 🔥 resize + compress + base64 (më agresiv)
        const manipulated = await ImageManipulator.manipulateAsync(
          asset.uri,
          [{ resize: { width: 300 } }], // width 300px, height auto
          {
            compress: 0.2, // 0.2 = shumë e kompresuar
            format: ImageManipulator.SaveFormat.JPEG,
            base64: true,
          }
        );

        console.log(
          "📐 manipulated base64 length:",
          manipulated.base64 ? manipulated.base64.length : 0
        );

        setSelectedImage({
          uri: manipulated.uri,
          base64: manipulated.base64,
        });
      }
    } catch (e) {
      console.log("Image pick error:", e);
      Alert.alert("Error", "Could not open image picker.");
    }
  };

  const handlePost = () => {
    console.log("🟢 handlePost clicked");

    if (!onSubmit) {
      console.log("No onSubmit handler passed");
      return;
    }

    const imageBase64 = selectedImage?.base64 || null;

    console.log(
      "🟢 Sending form data:",
      imageBase64
        ? {
            productName,
            category: selected,
            price,
            description,
            imageBase64Length: imageBase64.length,
          }
        : { productName, category: selected, price, description, imageBase64Length: 0 }
    );

    onSubmit({
      productName,
      category: selected,
      price,
      description,
      imageBase64,
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Product Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter name"
        placeholderTextColor="#6B705C"
        value={productName}
        onChangeText={setProductName}
      />

      <Text style={styles.label}>Category</Text>
      <TouchableOpacity
        style={styles.dropdownButton}
        onPress={() => setOpen(!open)}
      >
        <Text style={styles.dropdownText}>{selected}</Text>
        <Text style={styles.icon}>{open ? "▲" : "▼"}</Text>
      </TouchableOpacity>

      {open && (
        <View style={styles.dropdownList}>
          <FlatList
            data={categories}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.option}
                onPress={() => {
                  setSelected(item);
                  setOpen(false);
                }}
              >
                <Text
                  style={[
                    styles.optionText,
                    selected === item && styles.selectedText,
                  ]}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}

      <Text style={styles.label}>Product Price</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter price"
        placeholderTextColor="#6B705C"
        keyboardType="numeric"
        value={price}
        onChangeText={setPrice}
      />

      <Text style={styles.label}>Description</Text>
      <TextInput
        style={[styles.input, { height: 80 }]}
        placeholder="Enter description"
        placeholderTextColor="#6B705C"
        multiline
        value={description}
        onChangeText={setDescription}
      />

      <Text style={styles.label}>Upload Picture</Text>

      <TouchableOpacity
        style={styles.uploadButton}
        onPress={handlePickImage}
        activeOpacity={0.8}
      >
        {selectedImage ? (
          <Image
            source={{ uri: selectedImage.uri }}
            style={styles.uploadImage}
            resizeMode="cover"
          />
        ) : (
          <Text style={styles.plus}>＋</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.postBtn}
        onPress={handlePost}
        disabled={loading}
      >
        <Text style={styles.postText}>{loading ? "POSTING..." : "POST"}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
    padding: 10,
  },
  label: {
    fontWeight: "700",
    color: "#2E5E2D",
    fontSize: 16,
  },
  input: {
    backgroundColor: "#DCC9A8",
    borderRadius: 30,
    paddingHorizontal: 16,
    height: 40,
    fontSize: 14,
    color: "#2E5E2D",
    padding: 10,
  },
  dropdownButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#DCC9A8",
    borderRadius: 30,
    paddingHorizontal: 16,
    height: 44,
  },
  dropdownText: {
    color: "#2E5E2D",
    fontWeight: "600",
  },
  icon: {
    color: "#2E5E2D",
    fontSize: 14,
  },
  dropdownList: {
    backgroundColor: "#FAF2E7",
    borderRadius: 12,
    marginTop: 6,
    borderWidth: 1,
    borderColor: "#C9BDA7",
  },
  option: {
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  optionText: {
    color: "#2E5E2D",
    fontSize: 15,
  },
  selectedText: {
    fontWeight: "bold",
    color: "#1B3C1A",
  },
  uploadButton: {
    width: 45,
    height: 45,
    borderRadius: 50,
    backgroundColor: "#DCC9A8",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    overflow: "hidden",
  },
  plus: {
    color: "#2E5E2D",
    fontSize: 24,
    fontWeight: "bold",
  },
  uploadImage: {
    width: "100%",
    height: "100%",
    borderRadius: 50,
  },
  postBtn: {
    marginTop: 20,
    backgroundColor: "#DCC9A8",
    borderRadius: 30,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  postText: {
    color: "#2E5E2D",
    fontWeight: "700",
    letterSpacing: 1,
  },
});
