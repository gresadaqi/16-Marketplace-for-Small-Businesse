import React, { useMemo, useState, useCallback } from "react";
import { Ionicons } from "@expo/vector-icons";
import NavBar from "../components/NavBar"; 
import ProfileIcon from "../components/ProfileIcon";
import {
  SafeAreaView,
  View,
  Text,
  Image,
  StyleSheet,
  Pressable,
  ScrollView,
  Alert,
  Modal,
  TextInput,
  Platform,
} from "react-native";

/* ---------- DATA DEMO ---------- */
const INITIAL_ITEMS = [
  {
    id: "1",
    title: "T Shirts",
    brand: "Business Name",
    price: 10,
    img: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: "2",
    title: "T Shirts",
    brand: "Business Name",
    price: 10,
    img: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=600&auto=format&fit=crop",
  },
];
const NAV_H = 76; 
export default function YourBasket() {
  const [items, setItems] = useState(INITIAL_ITEMS);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [codAgree, setCodAgree] = useState(false);

  const dateStr = useMemo(() => {
    const d = new Date();
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const yyyy = d.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  }, []);

  const total = useMemo(
    () => items.reduce((s, it) => s + it.price, 0),
    [items]
  );

  const handleRemove = useCallback((id) => {
    setItems((prev) => prev.filter((x) => x.id !== id));
  }, []);

  const openCheckout = useCallback(() => {
    if (items.length === 0) {
      Alert.alert("Basket is empty", "Shto diçka para se të vazhdosh.");
      return;
    }
    setConfirmOpen(true);
  }, [items.length]);

  const continueToDetails = useCallback(() => {
    setConfirmOpen(false);
    setDetailsOpen(true);
  }, []);

  const resetForm = () => {
    setAddress("");
    setPhone("");
    setCodAgree(false);
  };

  const placeOrder = useCallback(() => {
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
      Alert.alert("Kujdes", "Duhet të pranosh pagesën CASH në dorëzim.");
      return;
    }

    setDetailsOpen(false);
    Alert.alert(
      "Porosia u vendos",
      `Totali: $${total}\nAdresa: ${address}\nTel: ${phone}\nPagesa: Cash on Delivery`
    );
    resetForm();
  }, [address, phone, codAgree, total]);

  return (
    <SafeAreaView style={styles.screen}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Your Basket</Text>
        
      <ProfileIcon/>
      </View>

      {/* CONTENT */}
      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: NAV_H + 24 }]} 
      >
        {items.map((it) => (
          <View key={it.id} style={styles.card}>
            <Image source={{ uri: it.img }} style={styles.cardImg} />
            <View style={styles.cardInfo}>
              <Text style={styles.cardTitle}>{it.title}</Text>
              <Text style={styles.cardBrand}>{it.brand}</Text>
              <View style={styles.pricePill}>
                <Text style={styles.priceText}>$ {it.price}</Text>
              </View>
            </View>

            {/* DELETE */}
            <Pressable
              onPress={() => handleRemove(it.id)}
              style={({ pressed }) => [styles.deleteWrap, pressed && styles.pressed]}
              android_ripple={{ color: "rgba(212,55,44,0.15)" }}
            >
              <Text style={styles.deleteText}>✕</Text>
            </Pressable>
          </View>
        ))}

        {/* ORDER SUMMARY */}
        <View style={styles.summary}>
          <Text style={styles.summaryTitle}>Order Summary</Text>
          <Text style={styles.summaryDate}>{dateStr}</Text>

          {items.map((it) => (
            <View key={`s-${it.id}`} style={styles.sumRow}>
              <Text style={styles.sumLabel}>{it.title} L</Text>
              <View style={styles.sumLine} />
              <Text style={styles.sumVal}>${it.price}</Text>
            </View>
          ))}

          <View style={[styles.sumRow, { marginTop: 6 }]}>
            <Text style={[styles.sumLabel, { fontWeight: "800" }]}>Total</Text>
            <View style={styles.sumLine} />
            <Text style={[styles.sumVal, { fontWeight: "800" }]}>${total}</Text>
          </View>

          <Pressable
            onPress={openCheckout}
            disabled={items.length === 0}
            style={({ pressed }) => [
              styles.checkoutBtn,
              items.length === 0 && styles.checkoutBtnDisabled,
              pressed && items.length > 0 && styles.pressed,
            ]}
          >
            <Text
              style={[
                styles.checkoutText,
                items.length === 0 && { opacity: 0.7 },
              ]}
            >
              Check Out
            </Text>
          </Pressable>
        </View>
      </ScrollView>
 <NavBar
        active="basket"
        onHome={() => console.log("Go Home")}
        onBasket={() => console.log("Already Basket")}
        onProfile={() => console.log("Go Profile")}
      />
      {/* MODALS */}
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
  <Text style={{ fontWeight: "800" }}>${total}</Text>?
</Text>

<View style={styles.modalRow}>
  <Pressable
    onPress={() => setConfirmOpen(false)}
    style={({ pressed }) => [styles.modalBtnLight, pressed && styles.pressed]}
  >
    <Text style={styles.modalBtnLightText}>Cancel</Text>
  </Pressable>
  <Pressable
    onPress={continueToDetails}
    style={({ pressed }) => [styles.modalBtn, pressed && styles.pressed]}
  >
    <Text style={styles.modalBtnText}>Continue</Text>
  </Pressable>
</View>
</View>
</View>
</Modal>

{/* DETAILS */}
<Modal
  visible={detailsOpen}
  animationType="slide"
  transparent
  onRequestClose={() => setDetailsOpen(false)}
>
  <View style={styles.modalOverlay}>
    <View style={[styles.modalCard, { paddingBottom: 16 }]}>
      <Text style={styles.modalTitle}>Order Details</Text>

      <Text style={styles.label}>Delivery Address</Text>
      <TextInput
        placeholder="Street, No., City"
        value={address}
        onChangeText={setAddress}
        style={styles.input}
        multiline
      />

      <Text style={styles.label}>Phone Number</Text>
      <TextInput
        placeholder="+383 44 000 000"
        keyboardType={Platform.OS === "web" ? "default" : "phone-pad"}
        value={phone}
        onChangeText={setPhone}
        style={styles.input}
      />

      <Pressable
        onPress={() => setCodAgree((v) => !v)}
        style={({ pressed }) => [styles.checkRow, pressed && styles.pressedLight]}
      >
        <View style={[styles.checkbox, codAgree && styles.checkboxOn]}>
          {codAgree && <Ionicons name="checkmark" size={16} color="#1A1A1A" />}
        </View>
        <Text style={styles.checkText}>
          I agree that the payment will be made <Text style={{ fontWeight: "800" }}>CASH</Text> on delivery
        </Text>
      </Pressable>

      <View style={styles.modalRow}>
        <Pressable
          onPress={() => setDetailsOpen(false)}
          style={({ pressed }) => [styles.modalBtnLight, pressed && styles.pressed]}
        >
          <Text style={styles.modalBtnLightText}>Back</Text>
        </Pressable>
        <Pressable
          onPress={placeOrder}
          style={({ pressed }) => [styles.modalBtn, pressed && styles.pressed]}
        >
          <Text style={styles.modalBtnText}>Place Order</Text>
        </Pressable>
      </View>
    </View>
  </View>
</Modal>

    </SafeAreaView>
  );
}

/* ---------------- STYLES ---------------- */
const GREEN = "#2E5E2D";
const GREEN_BORDER = "#2E6E31";
const BEIGE = "#DCC9A8";
const CARD_BEIGE = "#E8D8BF";
const CREAM = "#FAF2E7";
const DARK = "#1A1A1A";
const PRICE_BG = "#3B2E28";
const RED = "#D4372C";

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: BEIGE },
  content: { padding: 16, paddingBottom: 24, gap: 14 },
  header: {
    height: 64,
    backgroundColor: GREEN,
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: 16,
    justifyContent: "space-between",
  },
  headerTitle: { color: "white", fontSize: 28, fontWeight: "800" },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: CARD_BEIGE,
    borderRadius: 16,
    borderWidth: 3,
    borderColor: GREEN_BORDER,
    padding: 10,
    gap: 12,
  },
  cardImg: { width: 64, height: 64, borderRadius: 10 },
  cardInfo: { flex: 1 },
  cardTitle: { color: GREEN, fontSize: 16, fontWeight: "800" },
  cardBrand: { color: "#5A5A5A", marginTop: 2 },
  pricePill: {
    alignSelf: "flex-start",
    marginTop: 8,
    paddingHorizontal: 12,
    height: 28,
    borderRadius: 999,
    backgroundColor: PRICE_BG,
    justifyContent: "center",
    alignItems: "center",
  },
  priceText: { color: "white", fontWeight: "800" },
  deleteWrap: { padding: 8 },
  deleteText: { color: RED, fontSize: 22, fontWeight: "900" },
  summary: {
    backgroundColor: CREAM,
    borderRadius: 18,
    padding: 16,
    marginTop: 8,
  },
  summaryTitle: { fontSize: 18, fontWeight: "800", textAlign: "center" },
  summaryDate: { textAlign: "center", color: "#777", marginTop: 4, marginBottom: 10 },
  sumRow: { flexDirection: "row", alignItems: "center", marginVertical: 4 },
  sumLabel: { color: DARK },
  sumLine: {
    flex: 1,
    marginHorizontal: 8,
    borderBottomWidth: 1,
    borderStyle: "dotted",
    borderColor: "#999",
    height: 1,
  },
  sumVal: { color: DARK },
  checkoutBtn: {
    marginTop: 14,
    height: 44,
    borderRadius: 999,
    backgroundColor: "#ADC97F",
    alignItems: "center",
    justifyContent: "center",
  },
  checkoutBtnDisabled: { backgroundColor: "#D9D9D9" },
  checkoutText: { color: "#1a1a1a", fontWeight: "800", letterSpacing: 1 },
  pressed: { opacity: 0.7, transform: [{ scale: 0.98 }] },
  pressedLight: { opacity: 0.85 },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  modalCard: {
    width: "100%",
    maxWidth: 540,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 18,
    gap: 12,
  },
  modalTitle: { fontSize: 20, fontWeight: "800", textAlign: "center" },
  modalText: { color: "#222", textAlign: "center" },
  modalRow: {
    marginTop: 6,
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
  modalBtnText: { fontWeight: "800", color: "#1A1A1A" },
  modalBtnLight: {
    paddingHorizontal: 16,
    height: 44,
    backgroundColor: "#EEE",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  modalBtnLightText: { fontWeight: "700", color: "#333" },
  label: { fontWeight: "700", marginTop: 6 },
  input: {
    borderWidth: 1,
    borderColor: "#DDD",
    backgroundColor: "#FAFAFA",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === "web" ? 10 : 8,
    minHeight: 42,
  },
  checkRow: { flexDirection: "row", alignItems: "center", gap: 10, marginTop: 10 },
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
  checkboxOn: { backgroundColor: "#CFEA78", borderColor: "#B7D85F" },
  checkText: { color: "#222" },

  
});
