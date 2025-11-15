// app/(client)/home.jsx
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
const BEIGE = "#F7E7C8";
const DISABLED_GRAY = "#B0B0B0";
const CHIP_BROWN = "#462E23";
const CARD_BORDER = "#2E6E3E";

const CATEGORIES = [
  { id: 1, name: "All", icon: require("../../assets/all.png.png") },
  { id: 2, name: "Clothes", icon: require("../../assets/tshirt.png") },
  { id: 3, name: "Accessories", icon: require("../../assets/accesories.png") },
  { id: 4, name: "Art", icon: require("../../assets/art.png") },
  { id: 5, name: "Other", icon: require("../../assets/others.png") },
];

export default function ClientHome() {
  const { user } = useAuth();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selected, setSelected] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const [addedProducts, setAddedProducts] = useState([]);

  const [selectedCategory, setSelectedCategory] = useState("All");

  const openModal = (item) => {
    setSelected(item);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelected(null);
  };

  // LOAD PRODUCTS
  const loadProducts = async () => {
    setLoading(true);
    setError("");
    try {
      const snap = await getDocs(collection(db, "products"));
      const list = [];
      snap.forEach((d) => list.push({ id: d.id, ...d.data() }));
      setProducts(list);
    } catch (e) {
      console.log("Error loading products:", e);
      setError("Failed to load products.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  // WATCH CART
  useEffect(() => {
    if (!user) return;

    const cartRef = collection(db, "users", user.uid, "cart");
    const unsub = onSnapshot(cartRef, (snap) => {
      const ids = snap.docs.map((d) => d.id);
      setAddedProducts(ids);
    });

    return unsub;
  }, [user]);

  // ADD TO CART
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
          businessId: product.ownerId || null,
          businessEmail: product.ownerEmail || null,
          businessName: product.ownerName || "Unknown Business",
          description: product.description || "",
          createdAt: new Date().toISOString(),
        },
        { merge: true }
      );

      setAddedProducts((prev) => [...prev, product.id]);
    } catch (e) {
      console.log("Add to Cart Error:", e);
    }
  };

  // FILTER BY CATEGORY
  const filteredProducts = products.filter((p) => {
    if (selectedCategory === "All") return true;
    const cat = (p.category || "Other").toLowerCase();
    return cat === selectedCategory.toLowerCase();
  });

  // RENDER CATEGORY
  const renderCategory = ({ item }) => {
    const isSelected = selectedCategory === item.name;
    return (
      <View style={{ alignItems: "center", marginBottom: 12 }}>
        <TouchableOpacity
          style={[
            styles.categoryBox,
            isSelected && styles.categoryBoxActive,
          ]}
          onPress={() => setSelectedCategory(item.name)}
        >
          <Image
            source={item.icon}
            style={styles.categoryImage}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <Text
          style={[
            styles.categoryText,
            isSelected && styles.categoryTextActive,
          ]}
        >
          {item.name}
        </Text>
      </View>
    );
  };

  // PRODUCT CARD
  const renderItem = ({ item }) => {
    return (
      <Pressable
        style={styles.productCard}
        onPress={() => openModal(item)}
        activeOpacity={0.85}
      >
        <View style={styles.productImageWrapper}>
          {item.imageUrl ? (
            <Image
              source={{ uri: item.imageUrl }}
              style={styles.productImage}
              resizeMode="cover"
            />
          ) : (
            <View
              style={[styles.productImage, { backgroundColor: "#301212ff" }]}
            />
          )}
        </View>

        <View style={styles.bottomInfoBoxSeparated}>
          <Text style={styles.productName} numberOfLines={1}>
            {item.name}
          </Text>
          <Text style={styles.productPrice}>{item.price} €</Text>
        </View>
      </Pressable>
    );
  };

  // UI
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

        {/* CATEGORY */}
        <View style={styles.catSection}>
          <Text style={styles.catTitle}>Category</Text>
          <View style={styles.catUnderline} />

          <FlatList
            data={CATEGORIES}
            renderItem={renderCategory}
            keyExtractor={(item) => item.id.toString()}
            numColumns={4}
            ItemSeparatorComponent={() => <View style={{ height: 15 }} />}
            columnWrapperStyle={{ justifyContent: "space-between" }}
            scrollEnabled={false}
          />
        </View>

        {loading && (
          <View style={styles.center}>
            <ActivityIndicator size="large" color={GREEN} />
          </View>
        )}

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        {!loading && !error && products.length === 0 && (
          <Text style={styles.emptyText}>No products yet.</Text>
        )}

        {!loading && !error && products.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>
              {selectedCategory === "All"
                ? "All products"
                : `${selectedCategory} products`}
            </Text>
            <View style={styles.sectionDivider} />

            {filteredProducts.length === 0 ? (
              <Text style={styles.emptyTextSmall}>
                No products in this category.
              </Text>
            ) : (
              <FlatList
                data={filteredProducts}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                numColumns={3}
                columnWrapperStyle={styles.gridRow}
                contentContainerStyle={styles.gridList}
                scrollEnabled={false}
              />
            )}
          </>
        )}
      </ScrollView>

      {/* MODAL */}
     <Modal visible={modalVisible} transparent animationType="slide">
  <Pressable style={styles.backdrop} onPress={closeModal}>
    <Pressable style={styles.modalCard} onPress={() => {}}>
      <View>
        {selected?.imageUrl ? (
          <Image
            source={{ uri: selected.imageUrl }}
            style={styles.modalImage}
          />
        ) : (
          <View
            style={[styles.modalImage, { backgroundColor: "#e9e9e9" }]}
          />
        )}

        <Text style={styles.modalTitle}>{selected?.name}</Text>
        <Text style={styles.modalPrice}>{selected?.price} €</Text>

        <Text style={styles.modalOwner}>
  By: {selected?.ownerEmail || selected?.ownerName || "Unknown Business"}
</Text>

        {selected?.category && (
          <Text style={styles.modalCategory}>
            Category: {selected.category}
          </Text>
        )}

        {selected?.description ? (
          <Text style={styles.modalDesc}>{selected.description}</Text>
        ) : (
          <Text style={styles.modalDescMuted}>No description provided.</Text>
        )}
      </View>

      <View style={styles.modalActions}>
        <TouchableOpacity
          disabled={addedProducts.includes(selected?.id)}
          style={[
            styles.modalBtn,
            styles.addBtn,
            addedProducts.includes(selected?.id) && {
              backgroundColor: "grey",
            },
          ]}
          onPress={() => handleAddToCart(selected)}
        >
          <Text style={styles.modalBtnText}>
            {addedProducts.includes(selected?.id) ? "Added" : "Add to cart"}
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
  catTitle: { fontSize: 18, color: GREEN, fontWeight: "bold" },
  catUnderline: {
    height: 2,
    backgroundColor: "#faf8f7ff",
    width: 180,
    marginBottom: 10,
    marginTop: 3,
    borderRadius: 2,
  },

  categoryBox: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#462e23ff",
    padding: 15,
    borderRadius: 15,
    width: 80,
    height: 75,
  },
  categoryBoxActive: {
    borderWidth: 2,
    borderColor: "#F7E7C8",
  },

  categoryImage: { width: 100, height: 80 },
  categoryText: {
    fontSize: 13,
    color: GREEN,
    marginTop: 5,
    fontWeight: "500",
  },
  categoryTextActive: {
    textDecorationLine: "underline",
  },

  sectionTitle: {
    color: GREEN,
    fontWeight: "bold",
    fontSize: 16,
    marginTop: 10,
    paddingHorizontal: 16,
  },
  sectionDivider: {
    height: 2,
    backgroundColor: "#faf8f7ff",
    width: 180,
    marginBottom: 10,
    marginTop: 3,
    marginLeft: 16,
    borderRadius: 2,
  },

  gridList: { paddingHorizontal: 12, paddingBottom: 24 },
  gridRow: { justifyContent: "space-between", marginBottom: 14 },

  productCard: {
    borderRadius: 15,
    margin: 5,
    width: "31%",
    overflow: "hidden",
    elevation: 3,
  },
  productImageWrapper: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 15,
    borderWidth: 3,
    borderColor: CARD_BORDER,
    overflow: "hidden",
  },
  productImage: {
    width: "100%",
    height: "100%",
    borderRadius: 12,
  },

  bottomInfoBoxSeparated: {
    backgroundColor: CHIP_BROWN,
    paddingVertical: 6,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
  },
  productName: {
    fontSize: 13,
    color: "#fff",
    fontWeight: "600",
  },
  productPrice: {
    fontSize: 11,
    color: "#F7E7C8",
    fontWeight: "500",
    marginTop: 2,
  },

  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.45)",
    justifyContent: "center",
    paddingHorizontal: 20,
     paddingVertical: 42,
  },
  modalCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    elevation: 6,
     maxHeight: "90%",
  },
  modalImage: {
    width: "100%",
    height: 230,
    borderRadius: 12,
    marginBottom: 12,
  },
  modalTitle: { fontSize: 20, fontWeight: "700", color: "#222" },
  modalPrice: { fontSize: 16, color: GREEN, marginTop: 4, marginBottom: 6 },
  modalOwner: {
    fontSize: 12,
    color: "#444",
    marginBottom: 6,
    fontWeight: "600",
  },
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
