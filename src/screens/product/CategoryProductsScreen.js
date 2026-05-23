import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import { getProductsByCategory } from "../../api/productApi";

export default function CategoryProductsScreen({ route, navigation }) {
  const { categoryId, name } = route.params;
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProductsByCategory(categoryId)
      .then((r) => {
        setProducts(r.data.content || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [categoryId]);

  if (loading)
    return (
      <ActivityIndicator style={{ flex: 1 }} size="large" color="#2563EB" />
    );

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.back} onPress={() => navigation.goBack()}>
        <Text style={styles.backText}>← {name}</Text>
      </TouchableOpacity>
      <FlatList
        data={products}
        numColumns={2}
        keyExtractor={(i) => String(i.productId)}
        ListEmptyComponent={<Text style={styles.empty}>Không có sản phẩm</Text>}
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
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FAFB", padding: 12 },
  back: { padding: 4, marginBottom: 12 },
  backText: { color: "#2563EB", fontSize: 16, fontWeight: "700" },
  card: {
    flex: 1,
    backgroundColor: "#fff",
    margin: 6,
    borderRadius: 14,
    padding: 10,
    elevation: 2,
  },
  img: { width: "100%", height: 120, borderRadius: 10, marginBottom: 8 },
  name: { fontSize: 13, fontWeight: "600", color: "#111827" },
  price: { fontSize: 14, fontWeight: "700", color: "#2563EB", marginTop: 4 },
  empty: { textAlign: "center", color: "#6B7280", marginTop: 40 },
});
