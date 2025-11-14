
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import { useAuth } from "../components/AuthProvider";
import { useRouter } from "expo-router";

const GREEN = "#2E5E2D";
const BEIGE = "#EADFC4";
const BROWN = "#3B2A24";
const GOLD = "#A6791A";
export default function ClientProfile() {
  const { user, logout } = useAuth();
  const router = useRouter();

  // 🔹 Lista e blerjeve – për momentin bosh
  // kur t’lidhni checkout-in, veç thirre setPurchases(data)
  const [purchases, setPurchases] = useState([]);

  const handleLogout = async () => {
    await logout();
    router.replace("/(auth)/login");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={{ paddingBottom: 30 }}>
        <View style={styles.container}>

          {/* HEADER */}
          <View style={styles.header}>
            {/* Avatar */}
            <View style={styles.avatarOuter}>
              <Image
                source={require("../../assets/profile.png")}
                style={styles.avatarImage}
              />
            </View>

            {/* User Info */}
            <View style={styles.infoContainer}>
              <Text style={styles.nameText}>
                {user?.displayName || "Name Surname"}
              </Text>
              <Text style={styles.emailText}>
                {user?.email || "email@example.com"}
              </Text>

              <TouchableOpacity style={styles.signOutButton} onPress={handleLogout}>
                <Text style={styles.signOutText}>Sign Out</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* PURCHASE HISTORY */}
          <View style={styles.historyCard}>
            <Text style={styles.historyTitle}>Purchase History</Text>

            {purchases.length === 0 ? (
              <Text style={styles.emptyText}>No purchases yet.</Text>
            ) : (
              purchases.map((item) => (
                <View key={item.id} style={styles.purchaseItem}>
                  <View style={styles.row}>
                    {/* Image */}
                    <View style={styles.imageWrapper}>
                      <Image
                        source={{ uri: item.image }}
                        style={styles.productImage}
                      />
                    </View>

                    {/* Info */}
                    <View style={styles.infoBox}>
                      <View style={styles.badge}>
                        <Text style={styles.badgeText}>{item.title}</Text>
                      </View>

                      <Text style={styles.infoText}>
                        <Text style={styles.infoLabel}>From: </Text>
                        {item.from}
                      </Text>

                      <Text style={styles.infoText}>
                        <Text style={styles.infoLabel}>Address: </Text>
                        {item.address}
                      </Text>

                      <Text style={styles.infoText}>
                        <Text style={styles.infoLabel}>Total: </Text>
                        {item.total}
                      </Text>
                    </View>
                  </View>

                  {/* Separator */}
                  <View style={styles.separator} />
                </View>
              ))
            )}
          </View>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

/* ------------------------------------ */
/*              STYLES                  */
/* ------------------------------------ */

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: BEIGE,
  },
  container: {
    paddingHorizontal: 24,
    paddingTop: 30,
  },

  /* HEADER */
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30,
  },
  avatarOuter: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: GOLD,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    backgroundColor: "#fff",
  },
  avatarImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
