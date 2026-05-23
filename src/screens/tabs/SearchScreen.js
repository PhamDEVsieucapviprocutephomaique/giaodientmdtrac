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
    } catch (e) {}
    setLoading(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.row}>
        <TextInput
          style={styles.input}
          value={keyword}
          onChangeText={setKeyword}
          placeholder="Tìm kiếm sản phẩm..."
          returnKeyType="search"
          onSubmitEditing={doSearch}
        />
        <TouchableOpacity style={styles.btn} onPress={doSearch}>
          <Text style={styles.btnText}>Tìm</Text>
        </TouchableOpacity>
      </View>
      {loading && (
        <ActivityIndicator color="#2563EB" style={{ marginTop: 20 }} />
      )}
      {searched && !loading && results.length === 0 && (
        <Text style={styles.empty}>Không tìm thấy sản phẩm</Text>
      )}
      <FlatList
        data={results}
        keyExtractor={(i) => String(i.productId)}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.item}
            onPress={() =>
              navigation.navigate("ProductDetail", { id: item.productId })
            }
          >
            <View style={{ flex: 1 }}>
              <Text style={styles.name} numberOfLines={2}>
                {item.productName}
              </Text>
              <Text style={styles.shop}>🏪 {item.shopName}</Text>
            </View>
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
  row: { flexDirection: "row", marginBottom: 12, gap: 8 },
  input: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    fontSize: 15,
  },
  btn: {
    backgroundColor: "#2563EB",
    borderRadius: 12,
    paddingHorizontal: 18,
    justifyContent: "center",
  },
  btnText: { color: "#fff", fontWeight: "700" },
  item: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 12,
    marginBottom: 8,
    flexDirection: "row",
    alignItems: "center",
    elevation: 1,
  },
  name: { fontSize: 14, fontWeight: "600", color: "#111827", flex: 1 },
  shop: { fontSize: 12, color: "#6B7280", marginTop: 4 },
  price: { fontSize: 14, fontWeight: "700", color: "#2563EB", marginLeft: 8 },
  empty: { textAlign: "center", color: "#6B7280", marginTop: 40, fontSize: 15 },
});
