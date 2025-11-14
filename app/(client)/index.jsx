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

  useEffect(() => {
    if (!user) return;
    const cartRef = collection(db, "users", user.uid, "cart");
    const unsub = onSnapshot(cartRef, (snap) => {
      const ids = snap.docs.map((d) => d.id);
      setAddedProducts(ids);
    });
    return unsub;
  }, [user]);

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
          createdAt: new Date().toISOString(),
        },
        { merge: true }
      );

      setAddedProducts((prev) => [...prev, product.id]);
    } catch (e) {
      console.log(e);
    }
  };

  const renderItem = ({ item }) => {
    const isAdded = addedProducts.includes(item.id);

    return (
      <Pressable style={styles.card} onPress={() => openModal(item)}>
        {item.imageUrl ? (
          <Image source={{ uri: item.imageUrl }} style={styles.thumb} />
        ) : (
          <View style={[styles.thumb, styles.thumbPlaceholder]} />
        )}

        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={styles.productName}>{item.name}</Text>

          {/* Category */}
          {item.category && (
            <Text style={styles.productCategory}>Category: {item.category}</Text>
          )}

          <Text style={styles.productPrice}>{item.price} €</Text>
          <Text style={styles.productOwner}>By: {item.ownerName || "Business"}</Text>

          <TouchableOpacity
            disabled={isAdded}
            style={[
              styles.cartButton,
              isAdded && { backgroundColor: DISABLED_GRAY },
            ]}
            onPress={(e) => {
              e?.stopPropagation?.();
              handleAddToCart(item);
            }}
          >
            <Text style={styles.cartButtonText}>
              {isAdded ? "Added" : "Add to cart"}
            </Text>
          </TouchableOpacity>
        </View>
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
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
        <FlatList
          data={products}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No products yet.</Text>
          }
        />
      )}

      {/* Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={closeModal}
      >
        <Pressable style={styles.backdrop} onPress={closeModal}>
          <Pressable style={styles.modalCard} onPress={() => {}}>

            {/* FIXED PIC — PERFECT FIT */}
            {selected?.imageUrl ? (
              <Image
                source={{ uri: selected.imageUrl }}
                style={styles.modalImage}
                resizeMode="contain"
              />
            ) : (
              <View style={[styles.modalImage, styles.thumbPlaceholder]} />
            )}

            <ScrollView style={{ maxHeight: 300 }}>
              <Text style={styles.modalTitle}>{selected?.name}</Text>
              <Text style={styles.modalPrice}>{selected?.price} €</Text>
              <Text style={styles.modalOwner}>
                By: {selected?.ownerName || "Business"}
              </Text>

              {selected?.category ? (
                <Text style={styles.modalCategory}>
                  Category: {selected.category}
                </Text>
              ) : null}

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
  header: { paddingHorizontal: 20, paddingVertical: 16 },
  title: { fontSize: 24, fontWeight: "700", color: GREEN },
  subtitle: { fontSize: 14, color: "#555", marginTop: 4 },
  list: { paddingHorizontal: 20, paddingBottom: 20 },

  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#eee",
    flexDirection: "row",
    alignItems: "center",
  },

  thumb: {
    width: 64,
    height: 64,
    borderRadius: 10,
  },
  thumbPlaceholder: {
    backgroundColor: "#e9e9e9",
  },

  productName: { fontSize: 18, fontWeight: "600" },
  productCategory: { fontSize: 12, color: "#333", marginBottom: 4 },
  productPrice: { fontSize: 16, color: GREEN, marginBottom: 4 },
  productOwner: { fontSize: 12, color: "#444", marginBottom: 8 },

  cartButton: {
    alignSelf: "flex-start",
    backgroundColor: GREEN,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
  },
  cartButtonText: { color: "#fff", fontWeight: "600" },

  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  errorText: { color: "red", paddingHorizontal: 20, marginBottom: 8 },
  emptyText: { textAlign: "center", color: "#777", marginTop: 40 },

  // Modal
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

  // FIXED IMAGE
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
  modalDescMuted: {
    fontSize: 14,
    color: "#777",
    fontStyle: "italic",
  },

  modalActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
    marginTop: 14,
  },
  modalBtn: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
  },
  addBtn: { backgroundColor: GREEN },
  closeBtn: { backgroundColor: LIGHT_GREEN },
  modalBtnText: { color: "#fff", fontWeight: "700" },
});
