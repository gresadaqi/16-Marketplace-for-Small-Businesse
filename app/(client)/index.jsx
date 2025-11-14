import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  Image,
} from "react-native";
import {
  collection,
  getDocs,
  setDoc,
  doc,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";
import { useAuth } from "../components/AuthProvider";

const GREEN = "#2E5E2D";
const LIGHT_GREEN = "#79AC78";
const BEIGE = "#EADFC4";
const DISABLED_GRAY = "#B0B0B0";
const CHIP_BROWN = "#5B4636";
const CARD_BORDER = "#6ea06c";

export default function ClientHome() {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selected, setSelected] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const [addedProducts, setAddedProducts] = useState([]);

  const openModal = (item) => {
    setSelected(item);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelected(null);
  };

  // ---------------- LOAD PRODUCTS ----------------
  const loadProducts = async () => {
    setLoading(true);
    setError("");
    try {
      const snap = await getDocs(collection(db, "products"));
      const list = [];
      snap.forEach((d) => list.push({ id: d.id, ...d.data() }));
      setProducts(list);
    } catch (e) {
      console.log(e);
      setError("Failed to load products.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  // ---------------- WATCH CART ----------------
  useEffect(() => {
    if (!user) return;

    const cartRef = collection(db, "users", user.uid, "cart");
    const unsub = onSnapshot(cartRef, (snap) => {
      const ids = snap.docs.map((d) => d.id);
      setAddedProducts(ids);
    });

    return unsub;
  }, [user]);

  // ---------------- ADD TO CART ----------------
  const handleAddToCart = async (product) => {
    if (!user) return;
    if (addedProducts.includes(product.id)) return;

    try {
      await setDoc(
        doc(db, "users", user.uid, "cart", product.id),
        {
          productId: product.id,
          name: product.name,
          price: product.price,
          imageUrl: product.imageUrl || null,
          category: product.category || null,

          // info e biznesit
          businessId: product.ownerId || null,
          businessEmail: product.ownerEmail || null,
          businessName: product.ownerName || "Unknown Business",

          createdAt: new Date().toISOString(),
        },
        { merge: true }
      );

      setAddedProducts((prev) => [...prev, product.id]);
    } catch (e) {
      console.log("Add to Cart Error:", e);
    }
  };

  // ---------------- CATEGORY BAR ----------------
  const CategoryBar = () => (
    <View style={styles.catSection}>
      <Text style={styles.sectionTitle}>Category</Text>
      <View style={styles.sectionDivider} />
      <View style={styles.catRow}>
        <CatItem emoji="🌀" title="All" />
        <CatItem emoji="👕" title="Clothes" />
        <CatItem emoji="🎒" title="Accessories" />
        <CatItem emoji="🖼️" title="Art" />
        <CatItem emoji="⋯" title="Other" />
      </View>
      <Text style={[styles.sectionTitle, { marginTop: 12 }]}>All</Text>
      <View style={styles.sectionDivider} />
    </View>
  );

  const CatItem = ({ emoji, title }) => (
    <View style={styles.catBtn}>
      <View style={styles.catIcon}>
        <Text style={styles.catEmoji}>{emoji}</Text>
      </View>
      <Text style={styles.catLabel}>{title}</Text>
    </View>
  );

  // ---------------- GRID ITEM ----------------
  const renderItem = ({ item }) => {
    return (
      <Pressable style={styles.gridItem} onPress={() => openModal(item)}>
        <View style={styles.imgCard}>
          {item.imageUrl ? (
            <Image source={{ uri: item.imageUrl }} style={styles.img} />
          ) : (
            <View style={[styles.img, { backgroundColor: "#e9e9e9" }]} />
          )}
        </View>

        <View style={styles.pillsWrap}>
          <View style={styles.pill}>
            <Text style={styles.pillText} numberOfLines={1}>
              {item.name}
            </Text>
          </View>
          <View style={styles.pill}>
            <Text style={styles.pillText}>€{item.price}</Text>
          </View>
        </View>
      </Pressable>
    );
  };

  // ---------------- UI ----------------
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.pageWrap}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Marketplace</Text>
          <Text style={styles.subtitle}>
            Browse products from local businesses
          </Text>
        </View>

        {loading && (
          <View style={styles.center}>
            <ActivityIndicator size="large" color={GREEN} />
          </View>
        )}

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        {!loading && !error && (
          <>
            <CategoryBar />
            <FlatList
              data={products}
              keyExtractor={(item) => item.id}
              renderItem={renderItem}
              numColumns={3}
              columnWrapperStyle={styles.gridRow}
              contentContainerStyle={styles.gridList}
              scrollEnabled={false}
              ListEmptyComponent={
                <Text style={styles.emptyText}>No products yet.</Text>
              }
            />
          </>
        )}
      </ScrollView>

      {/* ---------------- MODAL ---------------- */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <Pressable style={styles.backdrop} onPress={closeModal}>
          <Pressable style={styles.modalCard} onPress={() => {}}>
            <ScrollView
              style={{ maxHeight: 300 }}
              showsVerticalScrollIndicator={false}
            >
              {selected?.imageUrl ? (
                <Image
                  source={{ uri: selected.imageUrl }}
                  style={styles.modalImage}
                />
              ) : null}

              <Text style={styles.modalTitle}>{selected?.name}</Text>
              <Text style={styles.modalPrice}>{selected?.price} €</Text>

              <Text style={styles.modalOwner}>
                By: {selected?.ownerEmail || "Unknown Business"}
              </Text>

              {selected?.category && (
                <Text style={styles.modalCategory}>
                  Category: {selected.category}
                </Text>
              )}

              {selected?.description ? (
                <Text style={styles.modalDesc}>{selected.description}</Text>
              ) : (
                <Text style={styles.modalDescMuted}>
                  No description provided.
                </Text>
              )}
            </ScrollView>

            <View style={styles.modalActions}>
              <TouchableOpacity
                disabled={addedProducts.includes(selected?.id)}
                style={[
                  styles.modalBtn,
                  styles.addBtn,
                  addedProducts.includes(selected?.id) && {
                    backgroundColor: DISABLED_GRAY,
                  },
                ]}
                onPress={() => selected && handleAddToCart(selected)}
              >
                <Text style={styles.modalBtnText}>
                  {addedProducts.includes(selected?.id)
                    ? "Added"
                    : "Add to cart"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalBtn, styles.closeBtn]}
                onPress={closeModal}
              >
                <Text style={styles.modalBtnText}>Close</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: BEIGE },

  pageWrap: {
    width: "100%",
    maxWidth: 420,
    alignSelf: "center",
    flexGrow: 1,
    paddingBottom: 24,
  },

  header: { paddingHorizontal: 20, paddingVertical: 16 },
  title: { fontSize: 24, fontWeight: "700", color: GREEN },
  subtitle: { fontSize: 14, color: "#555", marginTop: 4 },

  catSection: { paddingHorizontal: 16, marginTop: 6, marginBottom: 10 },
  sectionTitle: { color: GREEN, fontWeight: "700", fontSize: 14 },
  sectionDivider: {
    height: 2,
    backgroundColor: GREEN,
    opacity: 0.25,
    width: "30%",
    marginTop: 6,
    marginBottom: 10,
    borderRadius: 2,
  },
  catRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    flexWrap: "wrap",
  },
  catBtn: { alignItems: "center", width: 64 },
  catIcon: {
    width: 54,
    height: 54,
    borderRadius: 12,
    backgroundColor: "#eee1c8",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: GREEN,
  },
  catEmoji: { fontSize: 22, color: GREEN },
  catLabel: { marginTop: 6, fontSize: 12, color: "#2f3b2f" },

  gridList: { paddingHorizontal: 12, paddingBottom: 24 },
  gridRow: { justifyContent: "space-between", marginBottom: 14 },
  gridItem: { width: "31%", alignItems: "center" },

  imgCard: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: CARD_BORDER,
    backgroundColor: "#fff",
    overflow: "hidden",
  },
  img: { width: "100%", height: "100%", borderRadius: 12 },

  pillsWrap: {
    width: "100%",
    marginTop: 8,
    gap: 6,
    alignItems: "center",
  },
  pill: {
    backgroundColor: CHIP_BROWN,
    borderRadius: 10,
    paddingVertical: 6,
    paddingHorizontal: 10,
    minWidth: "70%",
    alignItems: "center",
  },
  pillText: { color: "#fff", fontSize: 13, fontWeight: "700" },

  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  errorText: { color: "red", paddingHorizontal: 20, marginBottom: 8 },
  emptyText: { textAlign: "center", color: "#777", marginTop: 40 },

  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  modalCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    elevation: 6,
  },
  modalImage: {
    width: "100%",
    height: 230,
    borderRadius: 12,
    marginBottom: 12,
    backgroundColor: "#f0f0f0",
  },
  modalTitle: { fontSize: 20, fontWeight: "700", color: "#222" },
  modalPrice: { fontSize: 16, color: GREEN, marginTop: 4, marginBottom: 6 },
  modalOwner: { fontSize: 12, color: "#444", marginBottom: 6 },
  modalCategory: {
    fontSize: 12,
    color: "#1a1a1a",
    marginBottom: 10,
    fontWeight: "600",
  },
  modalDesc: { fontSize: 14, color: "#333", lineHeight: 20 },
  modalDescMuted: { fontSize: 14, color: "#777", fontStyle: "italic" },

  modalActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
    marginTop: 14,
  },
  modalBtn: { paddingHorizontal: 14, paddingVertical: 10, borderRadius: 10 },
  addBtn: { backgroundColor: GREEN },
  closeBtn: { backgroundColor: LIGHT_GREEN },
  modalBtnText: { color: "#fff", fontWeight: "700" },
});
