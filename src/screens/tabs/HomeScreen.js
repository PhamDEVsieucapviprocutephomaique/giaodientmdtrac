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
  RefreshControl,
  Dimensions,
  ScrollView,
} from "react-native";
import { getProducts } from "../../api/productApi";
import { getCategories } from "../../api/categoryApi";

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 36) / 2;

export default function HomeScreen({ navigation }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    try {
      const [p, c] = await Promise.all([getProducts(), getCategories()]);
      setProducts(p.data.content || []);
      setCategories(c.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={styles.scrollContent}
      >
        {/* Khoảng trống phía trên */}
        <View style={styles.topSpacer} />

        {/* Search Bar */}
        <TouchableOpacity
          style={styles.searchBar}
          onPress={() => navigation.navigate("Search")}
          activeOpacity={0.7}
        >
          <Text style={styles.searchText}>🔍 Tìm kiếm sản phẩm...</Text>
        </TouchableOpacity>

        {/* Categories Section */}
        <View style={styles.categoriesSection}>
          <Text style={styles.sectionLabel}>📂 Danh mục</Text>
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
                <Text style={styles.chipText} numberOfLines={1}>
                  {item.categoryName}
                </Text>
              </TouchableOpacity>
            )}
            contentContainerStyle={styles.chipList}
          />
        </View>

        {/* Products Section */}
        <View style={styles.productsSection}>
          <Text style={styles.sectionLabel}>✨ Sản phẩm nổi bật</Text>
          <View style={styles.productGrid}>
            {products.map((item) => (
              <TouchableOpacity
                key={item.productId}
                style={[styles.card, { width: CARD_WIDTH }]}
                onPress={() =>
                  navigation.navigate("ProductDetail", { id: item.productId })
                }
                activeOpacity={0.8}
              >
                <View style={styles.imageContainer}>
                  {item.imageUrl ? (
                    <Image source={{ uri: item.imageUrl }} style={styles.img} />
                  ) : (
                    <View style={styles.imgPlaceholder}>
                      <Text style={styles.placeholderIcon}>🛍️</Text>
                    </View>
                  )}
                </View>
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
            ))}
          </View>
          {products.length === 0 && (
            <Text style={styles.empty}>Không có sản phẩm nào</Text>
          )}
        </View>

        {/* Khoảng trống cuối trang */}
        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFC" },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  scrollContent: {
    paddingBottom: 30,
  },

  // Khoảng trống
  topSpacer: { height: 12 },
  bottomSpacer: { height: 20 },

  // Search Bar
  searchBar: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 14,
    marginHorizontal: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    shadowColor: "#000",
    shadowOpacity: 0.02,
    shadowRadius: 4,
    elevation: 1,
  },
  searchText: { color: "#94A3B8", fontSize: 15 },

  // Categories Section
  categoriesSection: {
    marginBottom: 8,
    marginHorizontal: 16,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1E293B",
    marginBottom: 10,
    marginLeft: 4,
  },
  chipList: {
    paddingVertical: 4,
  },
  chip: {
    backgroundColor: "#EFF6FF",
    borderRadius: 24,
    paddingHorizontal: 18,
    paddingVertical: 10,
    marginRight: 12,
    borderWidth: 1,
    borderColor: "#BFDBFE",
  },
  chipText: { color: "#2563EB", fontSize: 14, fontWeight: "600" },

  // Products Section
  productsSection: {
    paddingHorizontal: 16,
    marginTop: 8,
  },
  productGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 12,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  imageContainer: {
    width: "100%",
    height: 130,
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#F1F5F9",
    marginBottom: 10,
  },
  img: { width: "100%", height: "100%", resizeMode: "cover" },
  imgPlaceholder: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderIcon: { fontSize: 40 },
  name: {
    fontSize: 13,
    fontWeight: "600",
    color: "#1E293B",
    marginBottom: 4,
    lineHeight: 18,
  },
  price: { fontSize: 15, fontWeight: "700", color: "#2563EB", marginTop: 2 },
  shop: { fontSize: 11, color: "#64748B", marginTop: 4 },
  empty: { textAlign: "center", color: "#94A3B8", marginTop: 40, fontSize: 15 },
});
