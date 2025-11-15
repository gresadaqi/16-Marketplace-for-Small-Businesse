import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
} from "react-native";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";
import { useAuth } from "../components/AuthProvider";
import { useRouter } from "expo-router";

const GREEN = "#2E5E2D";
const BEIGE = "#EADFC4";
const BROWN = "#3B2A24";
const GOLD = "#A6791A";

export default function ClientProfile() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleLogout = async () => {
    await logout();
    router.replace("/(auth)/login");
  };

  useEffect(() => {
    if (!user) return;

    const ref = collection(db, "users", user.uid, "orders");

    const unsub = onSnapshot(
      ref,
      (snap) => {
        const list = snap.docs
          .map((d) => ({
            id: d.id,
            ...d.data(),
          }))
          .sort(
            (a, b) =>
              (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0)
          );
        setPurchases(list);
        setLoading(false);
      },
      (err) => {
        console.log("Error loading purchases:", err);
        setLoading(false);
      }
    );

    return unsub;
  }, [user]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={{ paddingBottom: 30 }}>
        <View style={styles.container}>
          {/* HEADER */}
          <View style={styles.header}>
            <View style={styles.avatarOuter}>
              <Image
                source={require("../../assets/profile.png")}
                style={styles.avatarImage}
              />
            </View>

            <View style={styles.infoContainer}>
              <Text style={styles.nameText}>
                {user?.displayName || "Name Surname"}
              </Text>
              <Text style={styles.emailText}>
                {user?.email || "email@example.com"}
              </Text>

              <TouchableOpacity
                style={styles.signOutButton}
                onPress={handleLogout}
              >
                <Text style={styles.signOutText}>Sign Out</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* PURCHASE HISTORY */}
          <View style={styles.historyCard}>
            <Text style={styles.historyTitle}>Purchase History</Text>

            {loading ? (
              <ActivityIndicator color={GREEN} style={{ marginTop: 10 }} />
            ) : purchases.length === 0 ? (
              <Text style={styles.emptyText}>No purchases yet.</Text>
            ) : (
              purchases.map((order) => (
                <View key={order.id} style={styles.purchaseItem}>
                  <Text style={styles.infoText}>
                    <Text style={styles.infoLabel}>From: </Text>
                    {order.businessEmail ||
                      order.items?.[0]?.businessEmail ||
                      order.items?.[0]?.businessName ||
                      "Business"}
                  </Text>

                  <Text style={styles.infoText}>
                    <Text style={styles.infoLabel}>Address: </Text>
                    {order.address}
                  </Text>

                  <Text style={styles.infoText}>
                    <Text style={styles.infoLabel}>Total: </Text>
                    {order.total} €
                  </Text>

                  <Text style={styles.infoText}>
                    <Text style={styles.infoLabel}>Status: </Text>
                    {order.status}
                  </Text>

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

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: BEIGE,
  },
  container: {
    paddingHorizontal: 24,
    paddingTop: 30,
  },

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
