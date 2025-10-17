import React from "react";
import { View, Text, StyleSheet, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const GREEN = "#2E5E2D";

export default function NavBar() {
  console.log("✅ NavBar rendered"); // DEBUG: duhet ta shohësh në Console
  return (
    <View style={styles.tabs}>
      <View style={styles.tabItem}>
        <Ionicons name="home-outline" size={22} color="#fff" />
        <Text style={styles.tabLabel}>Home</Text>
      </View>

      <View style={styles.centerTab}>
        <View style={styles.centerIconWrap}>
          <Ionicons name="cart" size={24} color="#1A1A1A" />
        </View>
        <Text style={styles.tabLabel}>Basket</Text>
      </View>

      <View style={styles.tabItem}>
        <Ionicons name="person-outline" size={22} color="#fff" />
        <Text style={styles.tabLabel}>Profile</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // i ngjitur poshtë (fixed për web, absolute për mobile)
  tabs: {
    position: Platform.OS === "web" ? "fixed" : "absolute",
    left: 0, right: 0, bottom: 0,
    height: 76,
    backgroundColor: GREEN,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingBottom: 8,
    zIndex: 999,             // sigurou që nuk mbulohet
  },
  tabItem: { alignItems: "center", justifyContent: "center" },
  tabLabel: { fontSize: 12, color: "white", marginTop: 4 },
  centerTab: { alignItems: "center", justifyContent: "center" },
  centerIconWrap: {
    width: 48, height: 48, borderRadius: 999,
    backgroundColor: "#ADC97F",
    alignItems: "center", justifyContent: "center", marginBottom: 2,
  },
});
