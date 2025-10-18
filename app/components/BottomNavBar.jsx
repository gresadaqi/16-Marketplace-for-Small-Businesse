import React from "react";
import { View, Text, StyleSheet, Pressable, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const GREEN = "#2E5E2D";
const LIGHT_GREEN = "#79AC78";
const BEIGE = "#EADFC4";

export default function BottomNavBar({ activeScreen = "home" }) {
  const router = useRouter();

  const handleNavigation = (screen) => {
    switch (screen) {
      case "login":
        router.push("/login");
        break;
      case "home":
        router.push("/home");
        break;
      case "basket":
        router.push("/basket");
        break;
      default:
        break;
    }
  };

  return (
    <View style={styles.container}>
      <Pressable 
        style={styles.tabItem} 
        onPress={() => handleNavigation("login")}
      >
        <Ionicons 
          name={activeScreen === "login" ? "log-in" : "log-in-outline"} 
          size={22} 
          color={activeScreen === "login" ? LIGHT_GREEN : "#fff"} 
        />
        <Text style={[
          styles.tabLabel, 
          activeScreen === "login" && styles.activeTabLabel
        ]}>
          Login
        </Text>
      </Pressable>

      <Pressable 
        style={styles.tabItem} 
        onPress={() => handleNavigation("home")}
      >
        <Ionicons 
          name={activeScreen === "home" ? "home" : "home-outline"} 
          size={22} 
          color={activeScreen === "home" ? LIGHT_GREEN : "#fff"} 
        />
        <Text style={[
          styles.tabLabel, 
          activeScreen === "home" && styles.activeTabLabel
        ]}>
          Home
        </Text>
      </Pressable>

      <Pressable 
        style={styles.tabItem} 
        onPress={() => handleNavigation("basket")}
      >
        <Ionicons 
          name={activeScreen === "basket" ? "basket" : "basket-outline"} 
          size={22} 
          color={activeScreen === "basket" ? LIGHT_GREEN : "#fff"} 
        />
        <Text style={[
          styles.tabLabel, 
          activeScreen === "basket" && styles.activeTabLabel
        ]}>
          Basket
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: Platform.OS === "web" ? "fixed" : "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 80,
    backgroundColor: GREEN,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingBottom: Platform.OS === "ios" ? 20 : 8,
    paddingTop: 8,
    zIndex: 999,
    borderTopWidth: 2,
    borderTopColor: LIGHT_GREEN,
  },
  tabItem: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    paddingVertical: 8,
  },
  tabLabel: {
    fontSize: 12,
    color: "#fff",
    marginTop: 4,
    fontWeight: "500",
  },
  activeTabLabel: {
    color: LIGHT_GREEN,
    fontWeight: "bold",
  },
});
