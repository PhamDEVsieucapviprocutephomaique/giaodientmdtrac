import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { getProductDetail } from "../../api/productApi";

export default function ProductDetailScreen({ route, navigation }) {
  const { id } = route.params;
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProductDetail(id)
      .then((r) => {
        setProduct(r.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading)
    return (
      <ActivityIndicator style={{ flex: 1 }} size="large" color="#2563EB" />
    );
  if (!product)
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Không tìm thấy sản phẩm</Text>
      </View>
    );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F9FAFB" }}>
      <ScrollView>
        <TouchableOpacity
          style={styles.back}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backText}>← Quay lại</Text>
        </TouchableOpacity>
        {product.imageUrl ? (
          <Image source={{ uri: product.imageUrl }} style={styles.img} />
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
            <Text style={{ fontSize: 60 }}>🛍</Text>
          </View>
        )}
        <View style={styles.body}>
          <Text style={styles.name}>{product.productName}</Text>
          <Text style={styles.price}>
            {product.price?.toLocaleString("vi-VN")}đ
          </Text>
          <TouchableOpacity
            style={styles.shopBtn}
            onPress={() =>
              navigation.navigate("ShopProducts", {
                shopId: product.shopId,
                name: product.shopName,
              })
            }
          >
            <Text style={styles.shopText}>🏪 {product.shopName}</Text>
          </TouchableOpacity>
          <View style={styles.infoRow}>
            <View style={styles.infoBox}>
              <Text style={styles.infoLabel}>Danh mục</Text>
              <Text style={styles.infoValue}>
                {product.categoryName || "N/A"}
              </Text>
            </View>
            <View style={styles.infoBox}>
              <Text style={styles.infoLabel}>Tồn kho</Text>
              <Text style={styles.infoValue}>{product.stockQuantity}</Text>
            </View>
            <View style={styles.infoBox}>
              <Text style={styles.infoLabel}>Đánh giá</Text>
              <Text style={styles.infoValue}>⭐ {product.averageRating}</Text>
            </View>
          </View>
          {product.description && (
            <>
              <Text style={styles.sectionTitle}>Mô tả sản phẩm</Text>
              <Text style={styles.desc}>{product.description}</Text>
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  back: { padding: 16 },
  backText: { color: "#2563EB", fontSize: 15, fontWeight: "600" },
  img: { width: "100%", height: 300 },
  body: { padding: 16 },
  name: { fontSize: 20, fontWeight: "700", color: "#111827", marginBottom: 8 },
  price: {
    fontSize: 26,
    fontWeight: "800",
    color: "#2563EB",
    marginBottom: 16,
  },
  shopBtn: {
    backgroundColor: "#EFF6FF",
    padding: 12,
    borderRadius: 10,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#BFDBFE",
  },
  shopText: { color: "#2563EB", fontWeight: "600", fontSize: 14 },
  infoRow: { flexDirection: "row", gap: 8, marginBottom: 16 },
  infoBox: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    alignItems: "center",
    elevation: 1,
  },
  infoLabel: { fontSize: 11, color: "#6B7280", marginBottom: 4 },
  infoValue: { fontSize: 13, fontWeight: "700", color: "#111827" },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 8,
  },
  desc: { fontSize: 14, color: "#374151", lineHeight: 22 },
});
