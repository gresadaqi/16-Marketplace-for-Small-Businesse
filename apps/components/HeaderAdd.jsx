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
const styles = StyleSheet.create({
  header: {
    height: 80,
    backgroundColor: GREEN,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    
  },
  title: {
    color: "#e0d6c8ff",
    fontSize: 27,
    fontWeight: "600",
    textAlign: "center",
   

   
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "white",
  },
});

