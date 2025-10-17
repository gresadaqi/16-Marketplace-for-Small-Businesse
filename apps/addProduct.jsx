import React from "react";
import { SafeAreaView, View, StyleSheet } from "react-native";
import Header from "../components/Header";
import ProductForm from "../components/ProductForm";
import ProductForm from "../components/Footer";

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <View style={styles.formWrapper}>
        <ProductForm />
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#d7ceb2ff" ,
  },
  });