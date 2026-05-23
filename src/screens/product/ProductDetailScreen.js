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
  Dimensions,
} from "react-native";
import { getProductDetail } from "../../api/productApi";

const { width } = Dimensions.get("window");

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
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  if (!product)
    return (
      <View style={styles.errorContainer}>
        <Text>Không tìm thấy sản phẩm</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backLink}>← Quay lại</Text>
        </TouchableOpacity>
      </View>
    );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backText}>← Quay lại</Text>
        </TouchableOpacity>

        <View style={styles.imageWrapper}>
          {product.imageUrl ? (
            <Image
              source={{ uri: product.imageUrl }}
              style={styles.mainImage}
            />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Text style={styles.placeholderBig}>🛍️</Text>
            </View>
          )}
        </View>

        <View style={styles.content}>
          <Text style={styles.productName}>{product.productName}</Text>
          <Text style={styles.productPrice}>
            {product.price?.toLocaleString("vi-VN")}đ
          </Text>

          <TouchableOpacity
            style={styles.shopCard}
            onPress={() =>
              navigation.navigate("ShopProducts", {
                shopId: product.shopId,
                name: product.shopName,
              })
            }
          >
            <Text style={styles.shopName}>🏪 {product.shopName}</Text>
          </TouchableOpacity>

          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Danh mục</Text>
              <Text style={styles.statValue}>
                {product.categoryName || "N/A"}
              </Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Tồn kho</Text>
              <Text style={styles.statValue}>{product.stockQuantity}</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Đánh giá</Text>
              <Text style={styles.statValue}>
                ⭐ {product.averageRating || 0}
              </Text>
            </View>
          </View>

          {product.description && (
            <View style={styles.descriptionBox}>
              <Text style={styles.sectionTitle}>📝 Mô tả sản phẩm</Text>
              <Text style={styles.description}>{product.description}</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFC" },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  errorContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  backLink: { color: "#2563EB", marginTop: 16, fontSize: 16 },
  backBtn: { paddingHorizontal: 16, paddingVertical: 12 },
  backText: { color: "#2563EB", fontSize: 15, fontWeight: "600" },
  imageWrapper: {
    width: width,
    height: width * 0.9,
    backgroundColor: "#F1F5F9",
  },
  mainImage: { width: "100%", height: "100%", resizeMode: "cover" },
  imagePlaceholder: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderBig: { fontSize: 80 },
  content: { padding: 16 },
  productName: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1E293B",
    marginBottom: 8,
  },
  productPrice: {
    fontSize: 28,
    fontWeight: "800",
    color: "#2563EB",
    marginBottom: 16,
  },
  shopCard: {
    backgroundColor: "#EFF6FF",
    padding: 14,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#BFDBFE",
  },
  shopName: { color: "#2563EB", fontWeight: "600", fontSize: 15 },
  statsRow: { flexDirection: "row", gap: 12, marginBottom: 20 },
  statBox: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.02,
    elevation: 1,
  },
  statLabel: { fontSize: 11, color: "#64748B", marginBottom: 4 },
  statValue: { fontSize: 14, fontWeight: "700", color: "#1E293B" },
  descriptionBox: { marginTop: 4 },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1E293B",
    marginBottom: 8,
  },
  description: { fontSize: 14, color: "#475569", lineHeight: 22 },
});
