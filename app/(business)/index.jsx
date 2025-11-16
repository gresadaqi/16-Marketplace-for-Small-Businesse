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
  query,
  where,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";
import { useAuth } from "../components/AuthProvider";

const GREEN = "#2E5E2D";
const BEIGE = "#F7E7C8";
const CHIP_BROWN = "#462E23";
const CARD_BORDER = "#2E6E3E";

const CATEGORIES = [
  { id: 1, name: "All", icon: require("../../assets/all.png.png") },
  { id: 2, name: "Clothes", icon: require("../../assets/tshirt.png") },
  {
    id: 3,
    name: "Accessories",
    icon: require("../../assets/accesories.png"),
  },
  { id: 4, name: "Art", icon: require("../../assets/art.png") },
  { id: 5, name: "Other", icon: require("../../assets/others.png") },
];

export default function BusinessHome() {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selected, setSelected] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [editDescription, setEditDescription] = useState("");

  const [selectedCategory, setSelectedCategory] = useState("All");

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

  useEffect(() => {
    if (!user) {
      setProducts([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    const q = query(
      collection(db, "products"),
      where("ownerId", "==", user.uid)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const list = snapshot.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }));
        setProducts(list);
        setLoading(false);
      },
      (err) => {
        console.log("onSnapshot error:", err);
        setError("Failed to load your products.");
        setLoading(false);
      }
    );

    return () => unsubscribe();
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

      setSelected((prev) => (prev ? { ...prev, ...updated } : prev));
      setIsEditing(false);
    } catch (e) {
      console.log(e);
    }
  };

  const handleDelete = async (product) => {
    try {
      await deleteDoc(doc(db, "products", product.id));
      if (selected?.id === product.id) closeModal();
    } catch (e) {
      console.log(e);
    }
  };

  const filteredProducts = products.filter((p) => {
    if (selectedCategory === "All") return true;
    const cat = (p.category || "Other").toLowerCase();
    return cat === selectedCategory.toLowerCase();
  });

  const getImageSource = (item) => {
    if (item.imageBase64) {
      return { uri: `data:image/jpeg;base64,${item.imageBase64}` };
    }
    if (item.imageUrl) {
      return { uri: item.imageUrl };
    }
    return null;
  };

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

  const renderItem = ({ item }) => {
    const imgSrc = getImageSource(item);

    return (
      <Pressable
        style={styles.productCard}
        onPress={() => openModal(item)}
      >
        <View style={styles.productImageWrapper}>
          {imgSrc ? (
            <Image
              source={imgSrc}
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
          <Text style={styles.businessName} numberOfLines={1}>
            {item.ownerName || item.ownerEmail || "Your business"}
          </Text>
        </View>
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.pageWrap}>
        <View style={styles.header}>
          <Text style={styles.title}>My Products</Text>
          <Text style={styles.subtitle}>
            Manage products created by your business.
          </Text>
        </View>

        {/* CATEGORY – si në HomeScreen */}
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
                numColumns={3}
                columnWrapperStyle={styles.gridRow}
                contentContainerStyle={styles.gridList}
                scrollEnabled={false}
              />
            )}
          </>
        )}
      </ScrollView>

      {}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={closeModal}
      >
        <Pressable style={styles.backdrop} onPress={closeModal}>
          <Pressable style={styles.modalCard} onPress={() => {}}>
            <ScrollView style={{ maxHeight: 300 }}>
              {(() => {
                const imgSrc = selected ? getImageSource(selected) : null;
                if (imgSrc) {
                  return (
                    <Image
                      source={imgSrc}
                      style={styles.modalImage}
                      resizeMode="contain"
                    />
                  );
                }
                return (
                  <View
                    style={[
                      styles.modalImage,
                      { backgroundColor: "#e9e9e9" },
                    ]}
                  />
                );
              })()}

              {!isEditing ? (
                <>
                  <Text style={styles.modalTitle}>{selected?.name}</Text>
                  <Text style={styles.modalPrice}>{selected?.price} €</Text>
                  <Text style={styles.modalOwner}>
                    By:{" "}
                    {selected?.ownerName ||
                      selected?.ownerEmail ||
                      "Your business"}
                  </Text>
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
  catTitle: { fontSize: 18, color: "#2E6E3E", fontWeight: "bold" },
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
  categoryImage: {
    width: 100,
    height: 80,
  },
  categoryText: {
    fontSize: 13,
    color: "#2E6E3E",
    marginTop: 5,
    fontWeight: "500",
  },
  categoryTextActive: {
    textDecorationLine: "underline",
  },

  sectionTitle: {
    color: "#2E6E3E",
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
  businessName: {
    fontSize: 9,
    color: "#F7E7C8",
    marginTop: 2,
  },

  center: { justifyContent: "center", alignItems: "center" },
  errorText: { color: "red", paddingHorizontal: 20, marginBottom: 8 },
  emptyText: { textAlign: "center", color: "#777", marginTop: 40 },
  emptyTextSmall: { textAlign: "center", color: "#777", marginTop: 10 },

  // MODAL
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
  modalOwner: { fontSize: 12, color: "#444", marginBottom: 4 },
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
