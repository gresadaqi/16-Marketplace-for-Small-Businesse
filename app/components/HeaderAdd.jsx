import React from "react";
import { View, Text, StyleSheet } from "react-native";

const GREEN = "#2E5E2D";

export default function HeaderAdd() {
  return (
    <View style={styles.header}>
      <Text style={styles.title}>Add new Product</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 80,
    backgroundColor: GREEN,
    justifyContent: "center",
    alignItems: "center",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  title: {
    color: "#e0d6c8ff",
    fontSize: 27,
    fontWeight: "600",
    textAlign: "center",
  },
});


