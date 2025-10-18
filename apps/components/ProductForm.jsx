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
import productImage2 from "../assets/Picture2.png"; // foto e paracaktuar

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
    </View>


);
}