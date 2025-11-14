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
import { collection, getDocs, deleteDoc, doc, query, where } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";
import { useAuth } from "../components/AuthProvider";

const GREEN = "#2E5E2D";
const BEIGE = "#EADFC4";

export default function BusinessHome() {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // modal state
  const [selected, setSelected] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const openModal = (item) => {
    setSelected(item);
    setModalVisible(true);
  };
  const closeModal = () => {
    setModalVisible(false);
    setSelected(null);
  };

  const loadProducts = async () => {
    if (!user) return;
    setLoading(true);
    setError("");
    try {
      const q = query(collection(db, "products"), where("ownerId", "==", user.uid));
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

  const handleDelete = async (product) => {
    try {
      await deleteDoc(doc(db, "products", product.id));
      setProducts((prev) => prev.filter((p) => p.id !== product.id));
      if (selected?.id === product.id) closeModal();
    } catch (e) {
      console.log(e);
    }
  };

  const renderItem = ({ item }) => (
    <Pressable style={styles.card} onPress={() => openModal(item)}>
      {/* thumbnail on the left */}
      {item.imageUrl ? (
        <Image source={{ uri: item.imageUrl }} style={styles.thumb} />
      ) : (
        <View style={[styles.thumb, styles.thumbPlaceholder]} />
      )}

      {/* info */}
      <View style={{ flex: 1, marginLeft: 12 }}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.price}>{item.price} €</Text>
      </View>

      {/* delete button (doesn't open modal) */}
      <TouchableOpacity
        style={styles.removeButton}
        onPress={(e) => {
          e?.stopPropagation?.();
          handleDelete(item);
        }}
        activeOpacity={0.85}
      >
        <Text style={styles.removeText}>Delete</Text>
      </TouchableOpacity>
    </Pressable>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.title}>My Products</Text>
        <Text style={styles.subtitle}>You can manage products you created.</Text>
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
            <Text style={styles.emptyText}>You haven't added any products yet.</Text>
          }
        />
      )}

      {/* product details popup */}
      <Modal visible={modalVisible} transparent animationType="slide" onRequestClose={closeModal}>
        <Pressable style={styles.backdrop} onPress={closeModal}>
          <Pressable style={styles.modalCard} onPress={() => {}}>
            <ScrollView style={{ maxHeight: 350 }}>
              {/* Image fits inside info area */}
              {selected?.imageUrl ? (
                <Image
                  source={{ uri: selected.imageUrl }}
                  style={styles.modalImage}
                  resizeMode="contain"
                />
              ) : null}

              <Text style={styles.modalTitle}>{selected?.name}</Text>
              <Text style={styles.modalPrice}>{selected?.price} €</Text>

              {/* ✅ Category line */}
              {selected?.category ? (
                <Text style={styles.modalCategory}>Category: {selected.category}</Text>
              ) : null}

              {selected?.description ? (
                <Text style={styles.modalDesc}>{selected.description}</Text>
              ) : (
                <Text style={styles.modalDescMuted}>No description provided.</Text>
              )}
            </ScrollView>

            <View style={styles.modalActions}>
              <TouchableOpacity style={[styles.modalBtn, styles.closeBtn]} onPress={closeModal}>
                <Text style={styles.modalBtnText}>Close</Text>
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
  safeArea: {
    flex: 1,
    backgroundColor: BEIGE,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: GREEN,
  },
  subtitle: {
    fontSize: 14,
    color: "#555",
    marginTop: 4,
  },
  list: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#eee",
  },
  thumb: {
    width: 56,
    height: 56,
    borderRadius: 10,
    backgroundColor: "#f0f0f0",
  },
  thumbPlaceholder: {
    backgroundColor: "#e9e9e9",
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
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

  // modal styles
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
    height: 160,
    marginBottom: 12,
    borderRadius: 12,
    backgroundColor: "#f0f0f0",
    alignSelf: "center",
  },
  modalTitle: { fontSize: 20, fontWeight: "700", color: "#222" },
  modalPrice: { fontSize: 16, color: GREEN, marginTop: 4, marginBottom: 6 },

  // ✅ category style
  modalCategory: {
    fontSize: 12,
    color: "#2d2d2d",
    fontWeight: "600",
    marginBottom: 10,
  },

  modalDesc: { fontSize: 14, color: "#333", lineHeight: 20 },
  modalDescMuted: { fontSize: 14, color: "#777", fontStyle: "italic" },
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
  closeBtn: { backgroundColor: GREEN },
  deleteBtn: { backgroundColor: "#e53935" },
  modalBtnText: { color: "#fff", fontWeight: "700" },
});
