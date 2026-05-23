import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from "react-native";
import { getSellerProducts, deleteProduct } from "../../api/sellerApi";

export default function SellerHomeScreen({ navigation }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadProducts = async () => {
    try {
      const res = await getSellerProducts();
      setProducts(res.data.content || []);
    } catch (e) {
      Alert.alert("Lỗi", "Tải sản phẩm thất bại");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadProducts();
  };

  const handleDelete = async (productId) => {
    try {
      await deleteProduct(productId);
      Alert.alert("Thành công", "Xóa sản phẩm thành công");
      loadProducts();
    } catch (e) {
      Alert.alert("Lỗi", "Xóa sản phẩm thất bại");
    }
  };

  if (loading)
    return (
      <ActivityIndicator style={{ flex: 1 }} size="large" color="#2563EB" />
    );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Sản phẩm của tôi</Text>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => navigation.navigate("CreateProduct")}
        >
          <Text style={styles.addBtnText}>+ Thêm</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={products}
        keyExtractor={(i) => String(i.productId)}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <Text style={styles.empty}>Chưa có sản phẩm nào</Text>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardContent}>
              <Text style={styles.name} numberOfLines={2}>
                {item.productName}
              </Text>
              <Text style={styles.price}>
                {item.price?.toLocaleString("vi-VN")}đ
              </Text>
              <Text style={styles.stock}>Tồn: {item.stockQuantity}</Text>
              <Text style={[styles.status, item.isApproved && styles.approved]}>
                {item.isApproved ? "✓ Đã duyệt" : "⏳ Chờ duyệt"}
              </Text>
            </View>
            <View style={styles.actions}>
              <TouchableOpacity
                style={styles.editBtn}
                onPress={() =>
                  navigation.navigate("EditProduct", { product: item })
                }
              >
                <Text style={styles.actionText}>✏️ Sửa</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.editBtn, styles.deleteBtn]}
                onPress={() =>
                  Alert.alert("Xóa sản phẩm", "Bạn chắc chắn muốn xóa?", [
                    { text: "Hủy", style: "cancel" },
                    {
                      text: "Xóa",
                      onPress: () => handleDelete(item.productId),
                    },
                  ])
                }
              >
                <Text style={[styles.actionText, styles.deleteText]}>
                  🗑️ Xóa
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FAFB", padding: 12 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: { fontSize: 20, fontWeight: "700", color: "#111827" },
  addBtn: {
    backgroundColor: "#2563EB",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
  },
  addBtnText: { color: "#fff", fontWeight: "700", fontSize: 14 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    elevation: 1,
  },
  cardContent: { marginBottom: 10 },
  name: { fontSize: 14, fontWeight: "700", color: "#111827", marginBottom: 6 },
  price: { fontSize: 16, fontWeight: "800", color: "#2563EB", marginBottom: 4 },
  stock: { fontSize: 12, color: "#6B7280", marginBottom: 4 },
  status: { fontSize: 11, color: "#F59E0B", fontWeight: "600" },
  approved: { color: "#10B981" },
  actions: { flexDirection: "row", gap: 8 },
  editBtn: {
    flex: 1,
    backgroundColor: "#EFF6FF",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#BFDBFE",
  },
  deleteBtn: { backgroundColor: "#FEE2E2", borderColor: "#FECACA" },
  actionText: { color: "#2563EB", fontWeight: "600", fontSize: 12 },
  deleteText: { color: "#DC2626" },
  empty: { textAlign: "center", color: "#6B7280", marginTop: 40, fontSize: 15 },
});
