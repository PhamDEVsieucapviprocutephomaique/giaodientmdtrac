import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import { getProducts } from "../../api/productApi";
import { getCategories } from "../../api/categoryApi";

export default function HomeScreen({ navigation }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getProducts(), getCategories()])
      .then(([p, c]) => {
        setProducts(p.data.content || []);
        setCategories(c.data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <ActivityIndicator style={{ flex: 1 }} size="large" color="#2563EB" />
    );

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        style={styles.searchBar}
        onPress={() => navigation.navigate("Search")}
      >
        <Text style={styles.searchText}>🔍 Tìm kiếm sản phẩm...</Text>
      </TouchableOpacity>

      <FlatList
        data={categories.slice(0, 8)}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(i) => String(i.categoryId)}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.chip}
            onPress={() =>
              navigation.navigate("CategoryProducts", {
                categoryId: item.categoryId,
                name: item.categoryName,
              })
            }
          >
            <Text style={styles.chipText}>{item.categoryName}</Text>
          </TouchableOpacity>
        )}
        style={{ marginBottom: 12 }}
      />

      <FlatList
        data={products}
        numColumns={2}
        keyExtractor={(i) => String(i.productId)}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() =>
              navigation.navigate("ProductDetail", { id: item.productId })
            }
          >
            {item.imageUrl ? (
              <Image source={{ uri: item.imageUrl }} style={styles.img} />
            ) : (
              <View
                style={[
                  styles.img,
                  {
                    backgroundColor: "#E5E7EB",
                    justifyContent: "center",
                    alignItems: "center",
                  },
                ]}
              >
                <Text style={{ fontSize: 30 }}>🛍</Text>
              </View>
            )}
            <Text style={styles.name} numberOfLines={2}>
              {item.productName}
            </Text>
            <Text style={styles.price}>
              {item.price?.toLocaleString("vi-VN")}đ
            </Text>
            <Text style={styles.shop} numberOfLines={1}>
              🏪 {item.shopName}
            </Text>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FAFB", padding: 12 },
  searchBar: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    flexDirection: "row",
    alignItems: "center",
  },
  searchText: { color: "#9CA3AF", fontSize: 15 },
  chip: {
    backgroundColor: "#EFF6FF",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderWidth: 1,
    borderColor: "#BFDBFE",
  },
  chipText: { color: "#2563EB", fontSize: 13, fontWeight: "600" },
  card: {
    flex: 1,
    backgroundColor: "#fff",
    margin: 6,
    borderRadius: 14,
    padding: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  img: { width: "100%", height: 130, borderRadius: 10, marginBottom: 8 },
  name: { fontSize: 13, fontWeight: "600", color: "#111827" },
  price: { fontSize: 14, fontWeight: "700", color: "#2563EB", marginTop: 4 },
  shop: { fontSize: 11, color: "#6B7280", marginTop: 2 },
});
