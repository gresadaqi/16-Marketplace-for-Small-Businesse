import React from "react";
import { SafeAreaView, View, StyleSheet } from "react-native";
import Header from "../components/HeaderAdd";
import ProductForm from "../components/ProductForm";
import  Footer from "../components/Footer";

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
  formWrapper: {
    margin: 20,
    padding: 20,
    backgroundColor: "#dedbcfff", // ngjyra e container-it të formës
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    
  },
});
  