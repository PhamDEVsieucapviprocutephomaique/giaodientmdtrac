import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { searchProducts } from "../../api/productApi";

export default function SearchScreen({ navigation }) {
  const [keyword, setKeyword] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const doSearch = async () => {
    if (!keyword.trim()) return;
    setLoading(true);
    setSearched(true);
    try {
      const res = await searchProducts({ keyword, page: 0, pageSize: 20 });
      setResults(res.data.content || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboard}
      >
        <FlatList
          data={results}
          keyExtractor={(i) => String(i.productId)}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          ListHeaderComponent={
            <>
              {/* Khoảng trống phía trên để đẩy ô tìm xuống */}
              <View style={styles.topSpacer} />

              {/* Search Section */}
              <View style={styles.searchSection}>
                <TextInput
                  style={styles.input}
                  value={keyword}
                  onChangeText={setKeyword}
                  placeholder="🔍 Tìm kiếm sản phẩm..."
                  placeholderTextColor="#94A3B8"
                  returnKeyType="search"
                  onSubmitEditing={doSearch}
                  autoFocus={false}
                />
                <TouchableOpacity style={styles.searchBtn} onPress={doSearch}>
                  <Text style={styles.searchBtnText}>Tìm</Text>
                </TouchableOpacity>
              </View>

              {loading && (
                <ActivityIndicator color="#2563EB" style={styles.loader} />
              )}

              {searched && !loading && results.length === 0 && (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyIcon}>🔍</Text>
                  <Text style={styles.emptyText}>Không tìm thấy sản phẩm</Text>
                </View>
              )}
            </>
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.resultItem}
              onPress={() =>
                navigation.navigate("ProductDetail", { id: item.productId })
              }
              activeOpacity={0.7}
            >
              <View style={styles.itemContent}>
                <Text style={styles.itemName} numberOfLines={2}>
                  {item.productName}
                </Text>
                <Text style={styles.itemShop}>🏪 {item.shopName}</Text>
              </View>
              <Text style={styles.itemPrice}>
                {item.price?.toLocaleString("vi-VN")}đ
              </Text>
            </TouchableOpacity>
          )}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFC" },
  keyboard: { flex: 1 },

  // Khoảng trống đẩy ô tìm xuống
  topSpacer: { height: 20 },

  searchSection: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 12,
  },
  input: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 14,
    fontSize: 15,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    color: "#1E293B",
  },
  searchBtn: {
    backgroundColor: "#2563EB",
    borderRadius: 14,
    paddingHorizontal: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  searchBtnText: { color: "#fff", fontWeight: "700", fontSize: 15 },
  loader: { marginTop: 20 },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 60,
  },
  emptyIcon: { fontSize: 48, marginBottom: 12 },
  emptyText: { fontSize: 16, color: "#94A3B8" },
  listContent: { paddingBottom: 30 },
  resultItem: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 14,
    marginHorizontal: 16,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  itemContent: { flex: 1, paddingRight: 12 },
  itemName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1E293B",
    marginBottom: 4,
  },
  itemShop: { fontSize: 12, color: "#64748B" },
  itemPrice: { fontSize: 15, fontWeight: "700", color: "#2563EB" },
});
