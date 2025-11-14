// app/(business)/home.jsx
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
  TextInput,
} from "react-native";
import {
  collection,
  getDocs,
  query,
  where,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";
import { useAuth } from "../components/AuthProvider";

const GREEN = "#2E5E2D";
const BEIGE = "#EADFC4";
const CHIP_BROWN = "#462E23";
const CARD_BORDER = "#2E6E3E";

const CATEGORIES = ["All", "Accessories", "Clothes", "Art", "Other"];

export default function BusinessHome() {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selected, setSelected] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  // edit
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [editDescription, setEditDescription] = useState("");

  // filter
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const openModal = (item) => {
    setSelected(item);
    setIsEditing(false);
    setEditName(item.name || "");
    setEditPrice(String(item.price ?? ""));
    setEditCategory(item.category || "");
    setEditDescription(item.description || "");
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelected(null);
    setIsEditing(false);
  };

  const loadProducts = async () => {
    if (!user) return;
    setLoading(true);
    setError("");
    try {
      const q = query(
        collection(db, "products"),
        where("ownerId", "==", user.uid)
      );
      const snap = await getDocs(q);
      const list = [];
      snap.forEach((d) => list.push({ id: d.id, ...d.data() }));
      setProducts(list);
    } catch (e) {
      console.log(e);
      setError("Failed to load your products.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, [user]);

  const handleSaveEdit = async () => {
    if (!selected) return;
    try {
      const newPrice = Number(editPrice);
      const updated = {
        name: editName.trim() || selected.name,
        price: !isNaN(newPrice) ? newPrice : selected.price,
        category: editCategory || null,
        description: editDescription || "",
      };

      await updateDoc(doc(db, "products", selected.id), updated);

      setProducts((prev) =>
        prev.map((p) => (p.id === selected.id ? { ...p, ...updated } : p))
      );
      setSelected((prev) => (prev ? { ...prev, ...updated } : prev));
      setIsEditing(false);
    } catch (e) {
      console.log(e);
    }
  };

  const handleDelete = async (product) => {
    try {
      await deleteDoc(doc(db, "products", product.id));
      setProducts((prev) => prev.filter((p) => p.id !== product.id));
      if (selected?.id === product.id) closeModal();
    } catch (e) {
      console.log(e);
    }
  };

  // filter sipas kategorisë
  const filteredProducts = products.filter((p) => {
    if (selectedCategory === "All") return true;
    const cat = (p.category || "Other").toLowerCase();
    return cat === selectedCategory.toLowerCase();
  });

  // 👉 dizajni i box-it si në screenshot
  const renderItem = ({ item }) => (
    <Pressable
      style={styles.productCard}
      activeOpacity={0.85}
      onPress={() => openModal(item)}
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
            style={[
              styles.productImage,
              { backgroundColor: "#e9e9e9" },
            ]}
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

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.pageWrap}>
        <View style={styles.header}>
          <Text style={styles.title}>My Products</Text>
          <Text style={styles.subtitle}>
            Manage products created by your business.
          </Text>
        </View>

        {/* Dropdown filter */}
        {products.length > 0 && (
          <View style={styles.filterBar}>
            <Text style={styles.filterLabel}>Category</Text>
            <TouchableOpacity
              style={styles.filterDropdown}
              onPress={() => setDropdownOpen((o) => !o)}
            >
              <Text style={styles.filterText}>{selectedCategory}</Text>
              <Text style={styles.filterIcon}>
                {dropdownOpen ? "▲" : "▼"}
              </Text>
            </TouchableOpacity>

            {dropdownOpen && (
              <View style={styles.filterList}>
                {CATEGORIES.map((cat) => (
                  <TouchableOpacity
                    key={cat}
                    style={styles.filterItem}
                    onPress={() => {
                      setSelectedCategory(cat);
                      setDropdownOpen(false);
                    }}
                  >
                    <Text
                      style={[
                        styles.filterItemText,
                        selectedCategory === cat && styles.filterItemTextActive,
                      ]}
                    >
                      {cat}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        )}

        {loading && (
          <View style={styles.center}>
            <ActivityIndicator size="large" color={GREEN} />
          </View>
        )}
        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        {!loading && !error && products.length === 0 && (
          <Text style={styles.emptyText}>
            You haven't added any products yet.
          </Text>
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
                numColumns={4}
                columnWrapperStyle={styles.gridRow}
                contentContainerStyle={styles.gridList}
                scrollEnabled={false}
              />
            )}
          </>
        )}
      </ScrollView>

      {/* MODAL: view / edit / delete */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={closeModal}
      >
        <Pressable style={styles.backdrop} onPress={closeModal}>
          <Pressable style={styles.modalCard} onPress={() => {}}>
            <ScrollView style={{ maxHeight: 300 }}>
              {selected?.imageUrl ? (
                <Image
                  source={{ uri: selected.imageUrl }}
                  style={styles.modalImage}
                  resizeMode="contain"
                />
              ) : (
                <View
                  style={[
                    styles.modalImage,
                    { backgroundColor: "#e9e9e9" },
                  ]}
                />
              )}

              {!isEditing ? (
                <>
                  <Text style={styles.modalTitle}>{selected?.name}</Text>
                  <Text style={styles.modalPrice}>{selected?.price} €</Text>
                  {selected?.category ? (
                    <Text style={styles.modalCategory}>
                      Category: {selected.category}
                    </Text>
                  ) : null}
                  {selected?.description ? (
                    <Text style={styles.modalDesc}>
                      {selected.description}
                    </Text>
                  ) : (
                    <Text style={styles.modalDescMuted}>
                      No description provided.
                    </Text>
                  )}
                </>
              ) : (
                <>
                  <Text style={styles.label}>Name</Text>
                  <TextInput
                    style={styles.input}
                    value={editName}
                    onChangeText={setEditName}
                  />

                  <Text style={styles.label}>Price (€)</Text>
                  <TextInput
                    style={styles.input}
                    value={editPrice}
                    onChangeText={setEditPrice}
                    keyboardType="numeric"
                  />

                  <Text style={styles.label}>Category</Text>
                  <TextInput
                    style={styles.input}
                    value={editCategory}
                    onChangeText={setEditCategory}
                    placeholder="Accessories / Clothes / Art / Other"
                  />

                  <Text style={styles.label}>Description</Text>
                  <TextInput
                    style={[
                      styles.input,
                      { height: 80, textAlignVertical: "top" },
                    ]}
                    multiline
                    value={editDescription}
                    onChangeText={setEditDescription}
                  />
                </>
              )}
            </ScrollView>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalBtn, styles.editBtn]}
                onPress={() => {
                  if (isEditing) handleSaveEdit();
                  else setIsEditing(true);
                }}
              >
                <Text style={styles.modalBtnText}>
                  {isEditing ? "Save" : "Edit"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalBtn, styles.deleteBtn]}
                onPress={() => selected && handleDelete(selected)}
              >
                <Text style={styles.modalBtnText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#F7E7C8" },
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

  // dropdown filter
  filterBar: {
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: GREEN,
    marginBottom: 4,
  },
  filterDropdown: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FBF2E3",
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#e1d4bd",
  },
  filterText: {
    fontSize: 14,
    color: GREEN,
    fontWeight: "700",
  },
  filterIcon: { fontSize: 12, color: GREEN },
  filterList: {
    marginTop: 6,
    backgroundColor: "#FFF9EF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e1d4bd",
    overflow: "hidden",
  },
  filterItem: { paddingVertical: 8, paddingHorizontal: 12 },
  filterItemText: { fontSize: 14, color: GREEN },
  filterItemTextActive: { fontWeight: "700" },

  sectionTitle: {
    color: GREEN,
    fontWeight: "700",
    fontSize: 14,
    paddingHorizontal: 16,
    marginTop: 6,
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

  // 🔥 dizajni i box-ave si në screenshot
  productCard: {
    borderRadius: 15,
    margin: 5,
    width: "20%",
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

  center: { justifyContent: "center", alignItems: "center" },
  errorText: { color: "red", paddingHorizontal: 20, marginBottom: 8 },
  emptyText: { textAlign: "center", color: "#777", marginTop: 40 },
  emptyTextSmall: { textAlign: "center", color: "#777", marginTop: 10 },

  // modal
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
  editBtn: { backgroundColor: GREEN },
  deleteBtn: { backgroundColor: "#e53935" },
  modalBtnText: { color: "#fff", fontWeight: "700" },

  label: {
    fontSize: 13,
    fontWeight: "600",
    marginTop: 8,
    marginBottom: 4,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    fontSize: 14,
    marginBottom: 4,
    backgroundColor: "#f9f9f9",
  },
});
