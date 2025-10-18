import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet, Platform } from "react-native";
import prdImage from "../../assets/Picture3.png";
import prdImage1 from "../../assets/Picture4.png";
import prdImage2 from "../../assets/Picture5.png";

const GREEN = "#1b4d1aff";

export default function NavBarBussines() {
  const [activeTab, setActiveTab] = useState("home");

  return (
    <View style={styles.tabs}>
      {/* HOME */}
      <TouchableOpacity
        style={[styles.tabItem, activeTab === "home" && styles.activeTab]}
        onPress={() => setActiveTab("home")}
        activeOpacity={0.8}
      >
        <Image source={prdImage} style={styles.icon} />
        <Text style={[styles.tabLabel, activeTab === "home" && styles.activeText]}>
          Home
        </Text>
      </TouchableOpacity>

      {/* ADD */}
      <TouchableOpacity
        style={[styles.tabItem, activeTab === "add" && styles.activeTab]}
        onPress={() => setActiveTab("add")}
        activeOpacity={0.8}
      >
        <Image source={prdImage2} style={styles.icon} />
        <Text style={[styles.tabLabel, activeTab === "add" && styles.activeText]}>
          Add
        </Text>
      </TouchableOpacity>

      {/* PROFILE */}
      <TouchableOpacity
        style={[styles.tabItem, activeTab === "profile" && styles.activeTab]}
        onPress={() => setActiveTab("profile")}
        activeOpacity={0.8}
      >
        <Image source={prdImage1} style={styles.icon} />
        <Text style={[styles.tabLabel, activeTab === "profile" && styles.activeText]}>
          Profile
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  tabs: {
    position: Platform.OS === "web" ? "fixed" : "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 96,
    backgroundColor: GREEN,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingBottom: 8,
    zIndex: 999,
  },
  tabItem: {
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    borderRadius: 10,
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: 10,
  },
  tabLabel: {
    fontSize: 15,
    color: "#6fc9629d",
    marginTop: 8,
    fontWeight: "600",
  },
  activeTab: {
    backgroundColor: "#ffffff44",
  },
  activeText: {
    color: "#ffffff",
    fontWeight: "bold",
  },
});
