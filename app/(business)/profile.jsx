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
import {
  collection,
  onSnapshot,
  doc,
  updateDoc,
  serverTimestamp,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";
import { useAuth } from "../components/AuthProvider";
import { useRouter } from "expo-router";

const GREEN = "#2E5E2D";
const BEIGE = "#EADFC4";
const BROWN = "#41322dff";
const GOLD = "#A6791A";
const CARD_BEIGE = "#fcfaf6ff";

export default function BusinessProfile() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const [selectedTab, setSelectedTab] = useState("ongoing");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const [ongoingOrders, setOngoingOrders] = useState([]);
  const [historyOrders, setHistoryOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleLogout = async () => {
    await logout();
    router.replace("/(auth)/login");
  };

  const currentTitle =
    selectedTab === "ongoing" ? "Ongoing Orders" : "Order History";

  // -------- LOAD BUSINESS ORDERS ----------
  useEffect(() => {
    if (!user) return;

    const ordersRef = collection(db, "businessOrders", user.uid, "orders");

    const unsub = onSnapshot(
      ordersRef,
      (snap) => {
        const list = snap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }));

        const ongoing = list.filter((o) => o.status === "pending");
        const history = list.filter((o) => o.status !== "pending");

        setOngoingOrders(ongoing);
        setHistoryOrders(history);
        setLoading(false);
      },
      (err) => {
        console.log("Error loading business orders:", err);
        setLoading(false);
      }
    );

    return unsub;
  }, [user]);

  // -------- CONFIRM / CANCEL ----------

  const confirmOrder = async (order) => {
    try {
      // 1) update business order status -> completed
      const businessRef = doc(
        db,
        "businessOrders",
        user.uid,
        "orders",
        order.id
      );

      await updateDoc(businessRef, {
        status: "completed",
        updatedAt: serverTimestamp(),
      });

      // 2) gjej dhe update porosinë te klienti
      if (!order.userId) {
        console.log("confirmOrder: missing userId on order", order.id);
        return;
      }

      let userOrderId = order.userOrderId;

      // nese nuk kemi userOrderId, provojmë me e gjet me query
      if (!userOrderId) {
        try {
          const userOrdersRef = collection(
            db,
            "users",
            order.userId,
            "orders"
          );

          const q = query(
            userOrdersRef,
            where("status", "==", "pending"),
            where("total", "==", order.total),
            where("address", "==", order.address)
          );

          const snap = await getDocs(q);
          if (!snap.empty) {
            userOrderId = snap.docs[0].id;
            console.log(
              "confirmOrder: found matching user order",
              userOrderId
            );
          } else {
            console.log(
              "confirmOrder: no matching pending user order found for",
              order.userId,
              order.id
            );
          }
        } catch (err) {
          console.log("confirmOrder: error searching user order:", err);
        }
      }

      if (userOrderId) {
        try {
          const userOrderRef = doc(
            db,
            "users",
            order.userId,
            "orders",
            userOrderId
          );

          await updateDoc(userOrderRef, {
            status: "completed",
            businessId: user.uid,
            businessEmail: user.email,
            updatedAt: serverTimestamp(),
          });
        } catch (err) {
          console.log("confirmOrder: error updating user order:", err);
        }
      }
    } catch (e) {
      console.log("Error confirming order:", e);
    }
  };

  const cancelOrder = async (order) => {
    try {
      const ref = doc(db, "businessOrders", user.uid, "orders", order.id);
      await updateDoc(ref, {
        status: "cancelled",
        updatedAt: serverTimestamp(),
      });
    } catch (e) {
      console.log("Error cancelling order:", e);
    }
  };

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
                {user?.displayName || "Business Name"}
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

          {/* CARD */}
          <View style={styles.ordersCard}>
            <TouchableOpacity
              style={styles.sectionHeader}
              onPress={() => setDropdownOpen((prev) => !prev)}
              activeOpacity={0.7}
            >
              <Text style={styles.sectionTitle}>{currentTitle}</Text>
              <Text style={styles.arrow}>{dropdownOpen ? "˄" : "˅"}</Text>
            </TouchableOpacity>

            {dropdownOpen && (
              <View style={styles.dropdown}>
                <TouchableOpacity
                  style={[
                    styles.dropdownItem,
                    selectedTab === "ongoing" && styles.dropdownItemSelected,
                  ]}
                  onPress={() => {
                    setSelectedTab("ongoing");
                    setDropdownOpen(false);
                  }}
                >
                  <Text
                    style={[
                      styles.dropdownText,
                      selectedTab === "ongoing" &&
                        styles.dropdownTextSelected,
                    ]}
                  >
                    Ongoing Orders
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.dropdownItem,
                    selectedTab === "history" && styles.dropdownItemSelected,
                  ]}
                  onPress={() => {
                    setSelectedTab("history");
                    setDropdownOpen(false);
                  }}
                >
                  <Text
                    style={[
                      styles.dropdownText,
                      selectedTab === "history" &&
                        styles.dropdownTextSelected,
                    ]}
                  >
                    Order History
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            {loading ? (
              <View style={{ paddingVertical: 20 }}>
                <ActivityIndicator color={GREEN} />
              </View>
            ) : selectedTab === "ongoing" ? (
              <View style={styles.listContainer}>
                {ongoingOrders.length === 0 ? (
                  <Text style={styles.emptyText}>No ongoing orders.</Text>
                ) : (
                  ongoingOrders.map((order) => (
                    <View key={order.id} style={styles.orderItem}>
                      <View style={styles.row}>
                        <View style={styles.orderInfo}>
                          <View style={styles.badge}>
                            <Text style={styles.badgeText}>
                              From: {order.userEmail || "Client"}
                            </Text>
                          </View>

                          <Text style={styles.infoText}>
                            <Text style={styles.infoLabel}>Address: </Text>
                            {order.address}
                          </Text>

                          <Text style={styles.infoText}>
                            <Text style={styles.infoLabel}>Phone: </Text>
                            {order.phone}
                          </Text>

                          <Text style={styles.infoText}>
                            <Text style={styles.infoLabel}>Total: </Text>
                            {order.total} €
                          </Text>

                          <View style={styles.actionsRow}>
                            <TouchableOpacity
                              style={styles.confirmCircle}
                              onPress={() => confirmOrder(order)}
                            >
                              <Text style={styles.confirmIcon}>✓</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                              style={styles.cancelButton}
                              onPress={() => cancelOrder(order)}
                            >
                              <Text style={styles.cancelText}>Cancel</Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                      </View>

                      <View style={styles.separator} />
                    </View>
                  ))
                )}
              </View>
            ) : (
              <View style={styles.listContainer}>
                {historyOrders.length === 0 ? (
                  <Text style={styles.emptyText}>No orders in history.</Text>
                ) : (
                  historyOrders.map((order) => (
                    <View key={order.id} style={styles.orderItem}>
                      <View style={styles.row}>
                        <View style={styles.orderInfo}>
                          <View style={styles.badge}>
                            <Text style={styles.badgeText}>
                              From: {order.userEmail || "Client"}
                            </Text>
                          </View>

                          <Text style={styles.infoText}>
                            <Text style={styles.infoLabel}>Address: </Text>
                            {order.address}
                          </Text>

                          <Text style={styles.infoText}>
                            <Text style={styles.infoLabel}>Phone: </Text>
                            {order.phone}
                          </Text>

                          <Text style={styles.infoText}>
                            <Text style={styles.infoLabel}>Total: </Text>
                            {order.total} €
                          </Text>

                          <Text style={styles.infoText}>
                            <Text style={styles.infoLabel}>Status: </Text>
                            {order.status}
                          </Text>
                        </View>
                      </View>

                      <View style={styles.separator} />
                    </View>
                  ))
                )}
              </View>
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
    paddingHorizontal: 16,
    paddingTop: 30,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 40,
  },
  avatarOuter: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 4,
    borderColor: GOLD,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    backgroundColor: "#fff",
    marginLeft: 30,
  },
  avatarImage: {
    width: "70%",
    height: "70%",
    resizeMode: "cover",
  },
  infoContainer: {
    marginLeft: 34,
  },
  nameText: {
    fontSize: 22,
    fontWeight: "700",
  },
  emailText: {
    fontSize: 14,
    marginTop: 4,
    marginBottom: 10,
  },
  signOutButton: {
    backgroundColor: BROWN,
    paddingHorizontal: 28,
    paddingVertical: 10,
    borderRadius: 14,
    alignSelf: "flex-start",
    marginTop: 14,
  },
  signOutText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
  },
  ordersCard: {
    marginTop: 12,
    backgroundColor: CARD_BEIGE,
    borderRadius: 20,
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 26,
    fontWeight: "700",
  },
  arrow: {
    fontSize: 20,
    marginLeft: 8,
  },
  dropdown: {
    alignSelf: "flex-start",
    marginBottom: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    overflow: "hidden",
    backgroundColor: "#fff",
  },
  dropdownItem: {
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  dropdownItemSelected: {
    backgroundColor: BEIGE,
  },
  dropdownText: {
    fontSize: 14,
  },
  dropdownTextSelected: {
    fontWeight: "700",
  },
  listContainer: {
    marginTop: 8,
  },
  emptyText: {
    fontSize: 13,
    color: "#555",
    marginBottom: 6,
  },
  orderItem: {
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
  },
  orderInfo: {
    flex: 1,
  },
  badge: {
    backgroundColor: BROWN,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    alignSelf: "flex-start",
    marginBottom: 6,
    minWidth: 120,
    alignItems: "center",
  },
  badgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700",
  },
  infoText: {
    fontSize: 13,
    marginTop: 2,
  },
  infoLabel: {
    fontWeight: "700",
  },
  separator: {
    height: 2,
    backgroundColor: GREEN,
    marginTop: 10,
  },
  actionsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  confirmCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: GREEN,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  confirmIcon: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
  },
  cancelButton: {
    paddingHorizontal: 18,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: "#ff6b6b",
    justifyContent: "center",
    alignItems: "center",
  },
  cancelText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600",
    textAlign: "center",
  },
});
