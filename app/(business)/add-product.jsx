
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";
import { useAuth } from "../components/AuthProvider";

const GREEN = "#2E5E2D";
const BEIGE = "#EADFC4";

export default function AddProductScreen() {
  const { user } = useAuth();
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleAdd = async () => {
    setError("");
    setMessage("");
    if (!name || !price) {
      setError("Name and price are required.");
      return;
    }
    const numeric = Number(price);
    if (isNaN(numeric)) {
      setError("Price must be a number.");
      return;
    }
    if (!user) {
      setError("You must be logged in.");
      return;
    }
    setLoading(true);
    try {
      await addDoc(collection(db, "products"), {
        name,
        price: numeric,
        description,
        ownerId: user.uid,
        ownerEmail: user.email,
        createdAt: new Date().toISOString(),
      });
      setName("");
      setPrice("");
      setDescription("");
      setMessage("Product added successfully ✅");
    } catch (e) {
      console.log(e);
      setError("Failed to add product.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.title}>Add Product</Text>
          <Text style={styles.subtitle}>Publish a new product to the marketplace.</Text>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}
          {message ? <Text style={styles.successText}>{message}</Text> : null}

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Name</Text>
            <TextInput
              placeholder="Product name"
              style={styles.input}
              value={name}
              onChangeText={setName}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Price (€)</Text>
            <TextInput
              placeholder="0.00"
              style={styles.input}
              keyboardType="decimal-pad"
              value={price}
              onChangeText={setPrice}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              placeholder="Short description"
              style={[styles.input, styles.textarea]}
              multiline
              value={description}
              onChangeText={setDescription}
            />
          </View>

          <TouchableOpacity
            style={styles.button}
            onPress={handleAdd}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Save product</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: BEIGE,
  },
  container: {
    flexGrow: 1,
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: GREEN,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#555",
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: "#333",
    marginBottom: 6,
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    fontSize: 16,
  },
  textarea: {
    minHeight: 80,
    textAlignVertical: "top",
  },
  button: {
    backgroundColor: GREEN,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  errorText: {
    color: "red",
    marginBottom: 8,
  },
  successText: {
    color: "green",
    marginBottom: 8,
  },
});
