import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
} from "react-native";
import productImage2 from "../../assets/Picture2.png"; 

export default function ProductForm() {
  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [selectedImage, setSelectedImage] = useState(productImage2);


  const [selected, setSelected] = useState("All");
  const [open, setOpen] = useState(false);
  const categories = ["All", "Accessories", "Clothes", "Art", "Other"];

  const handlePickImage = () => {
    
    setSelectedImage(productImage2);
  };
   const handlePost = () => {
    console.log({
      productName,
      category: selected,
      price,
      description,
      image: selectedImage,
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
      <TouchableOpacity style={styles.uploadButton} onPress={handlePickImage}>
        <Text style={styles.plus}>＋</Text>
      </TouchableOpacity>

      
      <TouchableOpacity style={styles.postBtn} onPress={handlePost}>
        <Text style={styles.postText}>POST</Text>
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    gap: 16,
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
    padding: 10
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
    marginLeft: 160,
  },
  plus: {
    color: "#2E5E2D",
    fontSize: 24,
    fontWeight: "bold",
    alignItems: "center",
    
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


