import React, { useEffect, useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  TextInput,
  Alert,
  ScrollView,
} from "react-native";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";
import { useAuth } from "../components/AuthProvider";

const GREEN = "#2E5E2D";
const BEIGE = "#EADFC4";

export default function CartScreen() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // checkout state
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [codAgree, setCodAgree] = useState(false);

  // ---------------- LOAD CART ----------------
  const loadCart = async () => {
    if (!user) return;
    setLoading(true);
    setError("");

    try {
      const snap = await getDocs(collection(db, "users", user.uid, "cart"));
      const list = [];
      snap.forEach((d) => list.push({ id: d.id, ...d.data() }));
      setItems(list);
    } catch (e) {
      console.log("Error loading cart:", e);
      setError("Failed to load cart.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCart();
  }, [user]);

  // ---------------- REMOVE FROM CART ----------------
  const handleRemove = async (item) => {
    if (!user) return;
    try {
      await deleteDoc(doc(db, "users", user.uid, "cart", item.id));
      setItems((prev) => prev.filter((i) => i.id !== item.id));
    } catch (e) {
      console.log("Error removing cart item:", e);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={{ flex: 1 }}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.price}>{item.price} €</Text>
      </View>
      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => handleRemove(item)}
      >
        <Text style={styles.removeText}>Remove</Text>
      </TouchableOpacity>
    </View>
  );

  // ---------------- TOTAL ----------------
  const total = useMemo(
    () =>
      items.reduce((sum, it) => {
        const p = Number(it.price) || 0;
        return sum + p;
      }, 0),
    [items]
  );

  const resetForm = () => {
    setAddress("");
    setPhone("");
    setCodAgree(false);
  };

  const openCheckout = () => {
    if (items.length === 0) {
      Alert.alert("Basket is empty", "Shto diçka para se të vazhdosh.");
      return;
    }
    setConfirmOpen(true);
  };

  const continueToDetails = () => {
    setConfirmOpen(false);
    setDetailsOpen(true);
  };

  // ---------------- PLACE ORDER ----------------
  const placeOrder = async () => {
    if (!user) return;

    const phoneOk = phone.replace(/\D/g, "").length >= 8;

    if (!address.trim()) {
      Alert.alert("Kujdes", "Shkruaj adresën e dorëzimit.");
      return;
    }
    if (!phoneOk) {
      Alert.alert("Kujdes", "Shkruaj një numër telefoni të vlefshëm.");
      return;
    }
    if (!codAgree) {
      Alert.alert(
        "Kujdes",
        "Duhet të pranosh që pagesa bëhet CASH në dorëzim."
      );
      return;
    }

    try {
      console.log("PlaceOrder pressed");

      // 1) përgatis artikujt nga cart
      const preparedItems = items.map((it) => ({
        cartItemId: it.id,
        productId: it.productId || it.id,
        name: it.name,
        price: Number(it.price) || 0,
        businessId: it.businessId || null,
        businessEmail: it.businessEmail || null,
        businessName: it.businessName || null,
      }));

      console.log("preparedItems:", preparedItems);

      // 2) order për user-in
      const userOrderData = {
        userId: user.uid,
        userEmail: user.email,
        items: preparedItems,
        total,
        address,
        phone,
        paymentMethod: "cash_on_delivery",
        status: "pending",
        createdAt: serverTimestamp(),
      };

      console.log("Saving user order with data:", userOrderData);

      // ruaj te users/{uid}/orders
      const userOrderRef = await addDoc(
        collection(db, "users", user.uid, "orders"),
        userOrderData
      );

      console.log("User order saved id:", userOrderRef.id);

      // 3) NDARJA E ITEM-ave sipas biznesit
      const byBusiness = {};
      for (const it of preparedItems) {
        if (!it.businessId) continue;
        if (!byBusiness[it.businessId]) {
          byBusiness[it.businessId] = [];
        }
        byBusiness[it.businessId].push(it);
      }

      const businessIds = Object.keys(byBusiness);
      console.log("Business IDs:", businessIds);

      // 4) order për secilin biznes
      for (const businessId of businessIds) {
        const businessItems = byBusiness[businessId];

        const businessOrderData = {
          userId: user.uid,
          userEmail: user.email,
          items: businessItems,
          total: businessItems.reduce(
            (sum, it) => sum + (Number(it.price) || 0),
            0
          ),
          address,
          phone,
          paymentMethod: "cash_on_delivery",
          status: "pending",
          createdAt: serverTimestamp(),
          // opsionale
          userOrderId: userOrderRef.id,
        };

        console.log(
          "Saving business order for:",
          businessId,
          businessOrderData
        );

        // 🔥 PATH-I DUHET TË PËRPUTHET ME RULES:
        // match /businessOrders/{businessId}/orders/{orderId}
        await addDoc(
          collection(db, "businessOrders", businessId, "orders"),
          businessOrderData
        );
      }

      // 5) fshij artikujt nga cart
      for (const it of items) {
        try {
          await deleteDoc(doc(db, "users", user.uid, "cart", it.id));
        } catch (e) {
          console.log("Failed to delete cart item", it.id, e);
        }
      }

      setItems([]);
      resetForm();
      setDetailsOpen(false);

      Alert.alert(
        "Porosia u vendos",
        `Order ID: ${userOrderRef.id}\nTotali: €${total}\nAdresa: ${address}\nTel: ${phone}\nPagesa: Cash on delivery`
      );
    } catch (e) {
      console.log("Error ne placeOrder:", e);
      Alert.alert(
        "Gabim",
        "Diçka shkoi keq gjatë vendosjes së porosisë.\n" +
          (e?.message || "")
      );
    }
  };

  // ---------------- UI ----------------
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.title}>My Cart</Text>
      </View>

      {loading && (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={GREEN} />
        </View>
      )}

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      {!loading && !error && (
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <Text style={styles.emptyText}>Your cart is empty.</Text>
          }
          ListFooterComponent={
            items.length > 0 ? (
              <View style={styles.summaryWrapper}>
                <View style={styles.summary}>
                  <Text style={styles.summaryTitle}>Order Summary</Text>
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Items</Text>
                    <Text style={styles.summaryValue}>{items.length}</Text>
                  </View>
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Total</Text>
                    <Text style={styles.summaryValue}>€{total}</Text>
                  </View>

                  <TouchableOpacity
                    onPress={openCheckout}
                    style={[
                      styles.checkoutBtn,
                      items.length === 0 && styles.checkoutBtnDisabled,
                    ]}
                    disabled={items.length === 0}
                  >
                    <Text style={styles.checkoutText}>Check Out</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : null
          }
        />
      )}

      {/* MODAL 1 – Confirm */}
      <Modal
        visible={confirmOpen}
        animationType="fade"
        transparent
        onRequestClose={() => setConfirmOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Confirm purchase?</Text>
            <Text style={styles.modalText}>
              Do you want to proceed with the order totaling{" "}
              <Text style={{ fontWeight: "800" }}>€{total}</Text>?
            </Text>

            <View style={styles.modalRow}>
              <TouchableOpacity
                onPress={() => setConfirmOpen(false)}
                style={styles.modalBtnLight}
              >
                <Text style={styles.modalBtnLightText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={continueToDetails}
                style={styles.modalBtn}
              >
                <Text style={styles.modalBtnText}>Continue</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* MODAL 2 – Details */}
      <Modal
        visible={detailsOpen}
        animationType="slide"
        transparent
        onRequestClose={() => setDetailsOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <ScrollView
            contentContainerStyle={styles.modalScroll}
            keyboardShouldPersistTaps="handled"
          >
            <View style={[styles.modalCard, { paddingBottom: 16 }]}>
              <Text style={styles.modalTitle}>Order Details</Text>

              <Text style={styles.label}>Delivery Address</Text>
              <TextInput
                placeholder="Street, No., City"
                value={address}
                onChangeText={setAddress}
                style={[styles.input, { height: 80 }]}
                multiline
              />

              <Text style={styles.label}>Phone Number</Text>
              <TextInput
                placeholder="+383 44 000 000"
                keyboardType="phone-pad"
                value={phone}
                onChangeText={setPhone}
                style={styles.input}
              />

              <TouchableOpacity
                onPress={() => setCodAgree((v) => !v)}
                style={styles.checkRow}
              >
                <View
                  style={[styles.checkbox, codAgree && styles.checkboxOn]}
                >
                  {codAgree && <Text style={styles.checkboxTick}>✓</Text>}
                </View>
                <Text style={styles.checkText}>
                  I agree that the payment will be made{" "}
                  <Text style={{ fontWeight: "800" }}>CASH</Text> on delivery
                </Text>
              </TouchableOpacity>

              <View style={styles.modalRow}>
                <TouchableOpacity
                  onPress={() => setDetailsOpen(false)}
                  style={styles.modalBtnLight}
                >
                  <Text style={styles.modalBtnLightText}>Back</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={placeOrder} style={styles.modalBtn}>
                  <Text style={styles.modalBtnText}>Place Order</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: BEIGE,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: GREEN,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#fff",
  },
  list: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#eee",
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    color: "#222",
  },
  price: {
    fontSize: 14,
    color: GREEN,
    marginTop: 4,
  },
  removeButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: "#e53935",
  },
  removeText: {
    color: "#fff",
    fontWeight: "600",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "red",
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  emptyText: {
    textAlign: "center",
    color: "#777",
    marginTop: 40,
  },

  summaryWrapper: {
    marginTop: 16,
  },
  summary: {
    backgroundColor: "#F7E7C8",
    borderRadius: 18,
    padding: 16,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 10,
    color: GREEN,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 4,
  },
  summaryLabel: {
    color: "#333",
  },
  summaryValue: {
    color: "#111",
    fontWeight: "700",
  },
  checkoutBtn: {
    marginTop: 14,
    height: 44,
    borderRadius: 999,
    backgroundColor: "#ADC97F",
    alignItems: "center",
    justifyContent: "center",
  },
  checkoutBtnDisabled: {
    backgroundColor: "#d8d8d8",
  },
  checkoutText: {
    color: "#1a1a1a",
    fontWeight: "800",
    letterSpacing: 1,
    textTransform: "uppercase",
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  modalScroll: {
    flexGrow: 1,
    justifyContent: "center",
    width: "100%",
  },
  modalCard: {
    width: "100%",
    maxWidth: 540,
    backgroundColor: "#F7E7C8",
    borderRadius: 16,
    padding: 18,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 8,
  },
  modalText: {
    color: "#222",
    textAlign: "center",
  },
  modalRow: {
    marginTop: 12,
    flexDirection: "row",
    gap: 10,
    justifyContent: "flex-end",
  },
  modalBtn: {
    paddingHorizontal: 16,
    height: 44,
    backgroundColor: "#ADC97F",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  modalBtnText: {
    fontWeight: "800",
    color: "#1A1A1A",
  },
  modalBtnLight: {
    paddingHorizontal: 16,
    height: 44,
    backgroundColor: "#EEE",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  modalBtnLightText: {
    fontWeight: "700",
    color: "#333",
  },

  label: {
    fontWeight: "700",
    marginTop: 10,
    marginBottom: 4,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#DDD",
    backgroundColor: "#FAFAFA",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    minHeight: 42,
  },
  checkRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 12,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    backgroundColor: "#EEE",
    borderWidth: 1,
    borderColor: "#CCC",
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxOn: {
    backgroundColor: "#CFEA78",
    borderColor: "#B7D85F",
  },
  checkboxTick: {
    color: "#1A1A1A",
    fontWeight: "800",
  },
  checkText: {
    color: "#222",
    flex: 1,
  },
});
