// apps/components/NavBar.js
import React from "react";
import { View, Text, StyleSheet, Pressable, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const GREEN = "#2E5E2D";

export default function NavBar({ active = "basket", onHome, onBasket, onProfile }) {
  return (
    <View style={styles.tabs}>
      <Pressable style={styles.tabItem} onPress={onHome}>
        <Ionicons name={active === "home" ? "home" : "home-outline"} size={22} color="#fff" />
        <Text style={styles.tabLabel}>Home</Text>
      </Pressable>

      <Pressable style={styles.centerTab} onPress={onBasket}>
        <View style={styles.centerIconWrap}>
          <Ionicons name={active === "basket" ? "cart" : "cart-outline"} size={24} color="#1A1A1A" />
        </View>
        <Text style={styles.tabLabel}>Basket</Text>
      </Pressable>

      <Pressable style={styles.tabItem} onPress={onProfile}>
        <Ionicons name={active === "profile" ? "person" : "person-outline"} size={22} color="#fff" />
        <Text style={styles.tabLabel}>Profile</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  tabs: {
    position: Platform.OS === "web" ? "fixed" : "absolute",
    left: 0, right: 0, bottom: 0,
    height: 76,
    backgroundColor: GREEN,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingBottom: 8,
    zIndex: 999,
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
