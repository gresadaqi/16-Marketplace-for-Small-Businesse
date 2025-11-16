
import React, { useState, useEffect } from "react";
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
import { db } from "../../firebase/firebaseConfig";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
} from "firebase/firestore";

const GREEN = "#2E5E2D";
const BEIGE = "#EADFC4";
const BROWN = "#3B2A24";
const GOLD = "#A6791A";

export default function ClientProfile() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const [pendingOrders, setPendingOrders] = useState([]);
  const [completedOrders, setCompletedOrders] = useState([]);

  const handleLogout = async () => {
    await logout();
    router.replace("/(auth)/login");
  };


  useEffect(() => {
    if (!user?.uid) return;

    const q = query(
      collection(db, "users", user.uid, "orders"),
      orderBy("createdAt", "desc")
    );

    const unsub = onSnapshot(q, (snap) => {
      const pending = [];
      const completed = [];

      snap.forEach((d) => {
        const data = d.data();
        const firstItem = data.items?.[0] || {};

        const baseOrder = {
  id: d.id,
  title: firstItem.name || "Order",


  from:
    firstItem.businessEmail ||
    firstItem.ownerEmail ||
    firstItem.businessName ||
    "Unknown business",

  address: data.address || "",
  total: data.total ? `${data.total} €` : "—",
  image: firstItem.image || firstItem.imageUrl || null,
  status: data.status || "pending",
  createdAt: data.createdAt,
};


        if (data.status === "completed") {
          completed.push(baseOrder);
        } else if (data.status === "pending") {
          pending.push(baseOrder);
        }
      });

      setPendingOrders(pending);
      setCompletedOrders(completed);
    });

    return () => unsub();
  }, [user?.uid]);

 
  const extractedName = user?.email
    ? user.email.split("@")[0]
    : "No name";

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={{ paddingBottom: 30 }}>
        <View style={styles.container}>

          {/* HEADER */}
          <View style={styles.header}>
            <View className="avatarOuter" style={styles.avatarOuter}>
              <Image
                source={require("../../assets/profile.png")}
                style={styles.avatarImage}
              />
            </View>

            <View style={styles.infoContainer}>
              {/* NAME */}
              <Text style={styles.nameText}>{extractedName}</Text>

              {/* EMAIL */}
              <Text style={styles.emailText}>{user?.email}</Text>

              <TouchableOpacity
                style={styles.signOutButton}
                onPress={handleLogout}
              >
                <Text style={styles.signOutText}>Sign Out</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* ONGOING ORDERS */}
          <View style={styles.historyCard}>
            <Text style={styles.historyTitle}>Ongoing Orders</Text>

            {pendingOrders.length === 0 ? (
              <Text style={styles.emptyText}>No ongoing orders.</Text>
            ) : (
              pendingOrders.map((item) => (
                <View key={item.id} style={styles.purchaseItem}>
                  <View style={styles.row}>

                    {/* IMAGE */}
                    <View style={styles.imageWrapper}>
                      {item.image ? (
                        <Image
                          source={{ uri: item.image }}
                          style={styles.productImage}
                        />
                      ) : (
                        <Image
                          source={require("../../assets/profile.png")}
                          style={styles.productImage}
                        />
                      )}
                    </View>

                    {/* INFO */}
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

                      <Text style={styles.infoText}>
                        <Text style={styles.infoLabel}>Status: </Text>
                        {item.status}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.separator} />
                </View>
              ))
            )}
          </View>

      
          <View style={styles.historyCard}>
            <Text style={styles.historyTitle}>Purchase History</Text>

            {completedOrders.length === 0 ? (
              <Text style={styles.emptyText}>No completed purchases yet.</Text>
            ) : (
              completedOrders.map((item) => (
                <View key={item.id} style={styles.purchaseItem}>
                  <View style={styles.row}>
                    
                    <View style={styles.imageWrapper}>
                      {item.image ? (
                        <Image
                          source={{ uri: item.image }}
                          style={styles.productImage}
                        />
                      ) : (
                        <Image
                          source={require("../../assets/profile.png")}
                          style={styles.productImage}
                        />
                      )}
                    </View>

                    
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

                      <Text style={styles.infoText}>
                        <Text style={styles.infoLabel}>Status: </Text>
                        {item.status}
                      </Text>
                    </View>
                  </View>

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

  /* LIST CARDS */
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
