import React from "react";
import { SafeAreaView, View, StyleSheet } from "react-native";
import Header from "../components/HeaderAdd";
import ProductForm from "../components/ProductForm";
import NavBarBussines from "../components/NavBarBussines";
import ProfileIcon from "../components/ProfileIcon";


export default function App() {
  return (
    <SafeAreaView style={styles.container}>
         <View style={styles.headerRow}>
      <Header />
       <ProfileIcon onPress={() => console.log("Profile clicked")} />
      </View>
      <View style={styles.formWrapper}>
        <ProductForm />
        
  <NavBarBussines/>
      </View>
      
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#d7ceb2ff" ,
  },
  
   headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#2E5E2D",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    paddingHorizontal: 20,
    height: 80,},

  formWrapper: {
    margin: 20,
    padding: 20,
    backgroundColor: "#dedbcfff", 
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  }
  
});
  