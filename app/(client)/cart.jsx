
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";
import { useAuth } from "../components/AuthProvider";

const GREEN = "#2E5E2D";
const BEIGE = "#EADFC4";

export default function CartScreen() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
      console.log(e);
      setError("Failed to load cart.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCart();
  }, [user]);

  const handleRemove = async (item) => {
    try {
      await deleteDoc(doc(db, "users", user.uid, "cart", item.id));
      setItems((prev) => prev.filter((i) => i.id !== item.id));
    } catch (e) {
      console.log(e);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={{ flex: 1 }}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.price}>{item.price} €</Text>
      </View>
      <TouchableOpacity style={styles.removeButton} onPress={() => handleRemove(item)}>
        <Text style={styles.removeText}>Remove</Text>
      </TouchableOpacity>
    </View>
  );

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
        />
      )}
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
});
