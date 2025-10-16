import React, { useMemo } from "react";
import {
  SafeAreaView,
  View,
  Text,
  Image,
  StyleSheet,
  Pressable,
  ScrollView,
} from "react-native";

// --- MOCK DATA (ndrysho sipas qejfit)
const ITEMS = [
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

export default function App() {
  const dateStr = useMemo(() => {
    const d = new Date();
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const yyyy = d.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  }, []);

  const total = ITEMS.reduce((s, it) => s + it.price, 0);

  return (
    <SafeAreaView style={styles.screen}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Your Basket</Text>
        <Image
          source={{
            uri: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?q=80&w=200&auto=format&fit=crop",
          }}
          style={styles.avatar}
        />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* LISTA E ARTIKUJVE */}
        {ITEMS.map((it) => (
          <View key={it.id} style={styles.card}>
            <Image source={{ uri: it.img }} style={styles.cardImg} />
            <View style={styles.cardInfo}>
              <Text style={styles.cardTitle}>{it.title}</Text>
              <Text style={styles.cardBrand}>{it.brand}</Text>
              <View style={styles.pricePill}>
                <Text style={styles.priceText}>$ {it.price}</Text>
              </View>
            </View>
            <Pressable onPress={() => {}} style={styles.deleteWrap}>
              <Text style={styles.deleteText}>✕</Text>
            </Pressable>
          </View>
        ))}

        {/* ORDER SUMMARY */}
        <View style={styles.summary}>
          <Text style={styles.summaryTitle}>Order Summary</Text>
          <Text style={styles.summaryDate}>{dateStr}</Text>

          {/* rreshtat */}
          {ITEMS.map((it) => (
            <View key={`s-${it.id}`} style={styles.sumRow}>
              <Text style={styles.sumLabel}>{it.title} L</Text>
              <View style={styles.sumLine} />
              <Text style={styles.sumVal}>${it.price}</Text>
            </View>
          ))}

          {/* total */}
          <View style={[styles.sumRow, { marginTop: 6 }]}>
            <Text style={[styles.sumLabel, { fontWeight: "800" }]}>Total</Text>
            <View style={styles.sumLine} />
            <Text style={[styles.sumVal, { fontWeight: "800" }]}>${total}</Text>
          </View>

          {/* butoni i zbehur */}
          <Pressable disabled style={styles.checkoutBtn}>
            <Text style={styles.checkoutText}>Check Out</Text>
          </Pressable>
        </View>
      </ScrollView>

      {/* BOTTOM TABS */}
      <View style={styles.tabs}>
        <View style={styles.tabItem}>
          <Text style={styles.tabIcon}>🏠</Text>
          <Text style={styles.tabLabel}>Home</Text>
        </View>

        <View style={styles.centerTab}>
          <View style={styles.centerIconWrap}>
            <Text style={styles.centerIcon}>🛍️</Text>
          </View>
          <Text style={styles.tabLabelActive}>Basket</Text>
        </View>

        <View style={styles.tabItem}>
          <Text style={styles.tabIcon}>👤</Text>
          <Text style={styles.tabLabel}>Profile</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

/* ----------------- STYLES ----------------- */
const GREEN = "#2E5E2D";
const GREEN_BORDER = "#2E6E31";
const BEIGE = "#DCC9A8"; // background
const CARD_BEIGE = "#E8D8BF";
const CREAM = "#FAF2E7";
const DARK = "#1A1A1A";
const PRICE_BG = "#3B2E28"; // kafe e errët për pill të çmimit
const RED = "#D4372C";

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: BEIGE },
  content: { padding: 16, paddingBottom: 110, gap: 14 },

  /* Header */
  header: {
    height: 64,
    backgroundColor: GREEN,
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: 16,
    justifyContent: "space-between",
  },
  headerTitle: { color: "white", fontSize: 28, fontWeight: "800" },
  avatar: { width: 32, height: 32, borderRadius: 999, borderWidth: 2, borderColor: "#fff" },

  /* Cart item */
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
  cardImg: {
    width: 64,
    height: 64,
    borderRadius: 10,
    backgroundColor: "#ddd",
  },
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

  /* Summary */
  summary: {
    backgroundColor: CREAM,
    borderRadius: 18,
    padding: 16,
    marginTop: 8,
  },
  summaryTitle: { fontSize: 18, fontWeight: "800", textAlign: "center" },
  summaryDate: { textAlign: "center", color: "#777", marginTop: 4, marginBottom: 10 },
  sumRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 4,
  },
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
    backgroundColor: "#D9D9D9",
    alignItems: "center",
    justifyContent: "center",
  },
  checkoutText: {
    color: "#5E6F59",
    fontWeight: "800",
    letterSpacing: 1,
  },

  /* Bottom tabs */
  tabs: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 76,
    backgroundColor: GREEN,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingBottom: 8,
  },
  tabItem: { alignItems: "center", justifyContent: "center" },
  tabIcon: { fontSize: 18, color: "white" },
  tabLabel: { fontSize: 12, color: "white", marginTop: 4 },

  centerTab: { alignItems: "center", justifyContent: "center" },
  centerIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 999,
    backgroundColor: "#ADC97F",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 2,
  },
  centerIcon: { fontSize: 22 },
  tabLabelActive: { fontSize: 12, color: "white" },
});
