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
  infoContainer: {
    marginLeft: 24,
    justifyContent: "center",
  },
  nameText: {
    fontSize: 26,
    fontWeight: "700",
  },
  emailText: {
    fontSize: 16,
    marginTop: 4,
    marginBottom: 12,
  },
  signOutButton: {
    backgroundColor: BROWN,
    paddingVertical: 10,
    paddingHorizontal: 22,
    borderRadius: 16,
    alignSelf: "flex-start",
  },
  signOutText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },

  /* PURCHASE HISTORY */
  historyCard: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 20,
    marginTop: 10,
  },
  historyTitle: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 14,
    color: "#555",
  },
  purchaseItem: {
    marginBottom: 12,
  },
  row: {
    flexDirection: "row",
  },
  imageWrapper: {
    width: 80,
    height: 80,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: GREEN,
    overflow: "hidden",
    marginRight: 12,
  },
  productImage: {
    width: "100%",
    height: "100%",
  },
  infoBox: {
    flex: 1,
  },
  badge: {
    backgroundColor: BROWN,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 6,
    alignSelf: "flex-start",
  },
  badgeText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "700",
  },
  infoText: {
    fontSize: 14,
    marginTop: 2,
  },
  infoLabel: {
    fontWeight: "700",
  },
  separator: {
    height: 2,
    backgroundColor: GREEN,
    marginTop: 12,
  },
});
