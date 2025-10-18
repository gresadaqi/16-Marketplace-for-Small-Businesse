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
  
}
