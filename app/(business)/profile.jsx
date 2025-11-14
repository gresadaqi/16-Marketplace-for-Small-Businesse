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
const BROWN = "#41322dff";
const GOLD = "#A6791A";
const CARD_BEIGE = "#fcfaf6ff";

export default function BusinessProfile() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const [selectedTab, setSelectedTab] = useState("ongoing");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // LISTAT JANË BOSHE – PRODUKTET VIN MË VONË PREJ FIREBASE
  const [ongoingOrders, setOngoingOrders] = useState([]);
  const [historyOrders, setHistoryOrders] = useState([]);

  const handleLogout = async () => {
    await logout();
    router.replace("/(auth)/login");
  };

  const currentTitle =
    selectedTab === "ongoing" ? "Ongoing Orders" : "Order History";

  const handleConfirm = (id) => {
    const order = ongoingOrders.find((o) => o.id === id);
    if (!order) return;

    setOngoingOrders((prev) => prev.filter((o) => o.id !== id));
    setHistoryOrders((prev) => [{ ...order, status: "Completed" }, ...prev]);
  };

  const handleCancel = (id) => {
    const order = ongoingOrders.find((o) => o.id === id);
    if (!order) return;

    setOngoingOrders((prev) => prev.filter((o) => o.id !== id));
    setHistoryOrders((prev) => [{ ...order, status: "Cancelled" }, ...prev]);
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
                      selectedTab === "ongoing" && styles.dropdownTextSelected,
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
                      selectedTab === "history" && styles.dropdownTextSelected,
                    ]}
                  >
                    Order History
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            {/* LISTA */}
            {selectedTab === "ongoing" ? (
              <View style={styles.listContainer}>
                {ongoingOrders.length === 0 ? (
                  <Text style={styles.emptyText}>No ongoing orders.</Text>
                ) : (
                  ongoingOrders.map((item) => (
                    <View key={item.id} style={styles.orderItem}>
                      <View style={styles.row}>
                        <View style={styles.imageWrapper}>
                          <Image
                            source={{ uri: item.image }}
                            style={styles.productImage}
                          />
                        </View>

                        <View style={styles.orderInfo}>
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

                          <View style={styles.actionsRow}>
                            <TouchableOpacity
                              style={styles.confirmCircle}
                              onPress={() => handleConfirm(item.id)}
                            >
                              <Text style={styles.confirmIcon}>✓</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                              style={styles.cancelButton}
                              onPress={() => handleCancel(item.id)}
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
                  historyOrders.map((item) => (
                    <View key={item.id} style={styles.orderItem}>
                      <View style={styles.row}>
                        <View style={styles.imageWrapper}>
                          <Image
                            source={{ uri: item.image }}
                            style={styles.productImage}
                          />
                        </View>

                        <View style={styles.orderInfo}>
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
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

/* ----------------------------------------- */
/*                 STYLES                    */
/* ----------------------------------------- */

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
  imageWrapper: {
    width: 90,
    height: 90,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: GREEN,
    overflow: "hidden",
    marginRight: 12,
    backgroundColor: "#fff",
  },
  productImage: {
    width: "100%",
    height: "100%",
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
