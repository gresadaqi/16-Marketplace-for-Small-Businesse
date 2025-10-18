import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import productImage from "../assets/profile.png";


const GREEN = "#2E5E2D";

export default function HeaderAdd() {
  return (
    <View style={styles.header}>
      <Text style={styles.title}>Add new Product</Text>
      <Image
  source={productImage}
  style={{ width: 50, height: 50, borderRadius: 10 }}
/>

    </View>
  );
}
