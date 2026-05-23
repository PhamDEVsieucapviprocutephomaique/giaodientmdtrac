import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { updateProduct } from "../../api/sellerApi";
import { getCategories } from "../../api/categoryApi";

export default function EditProductScreen({ route, navigation }) {
  const { product } = route.params;
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const [form, setForm] = useState({
    productName: product.productName,
    description: product.description || "",
    price: String(product.price),
    stockQuantity: String(product.stockQuantity),
    imageUrl: product.imageUrl || "",
    categoryId: product.categoryId,
  });

  useEffect(() => {
    getCategories()
      .then((res) => setCategories(res.data || []))
      .catch(() => Alert.alert("Lỗi", "Tải danh mục thất bại"));
  }, []);

  const handleUpdate = async () => {
    if (!form.productName || !form.price || !form.stockQuantity) {
      Alert.alert("Lỗi", "Vui lòng điền đầy đủ thông tin bắt buộc");
      return;
    }
    setLoading(true);
    try {
      await updateProduct(product.productId, {
        productName: form.productName,
        description: form.description,
        price: parseFloat(form.price),
        stockQuantity: parseInt(form.stockQuantity),
        imageUrl: form.imageUrl,
        categoryId: form.categoryId,
      });
      Alert.alert("Thành công", "Cập nhật sản phẩm thành công", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    } catch (e) {
      Alert.alert("Lỗi", e.response?.data?.message || "Cập nhật thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F9FAFB" }}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>← Quay lại</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Chỉnh sửa sản phẩm</Text>

        <Text style={styles.label}>Tên sản phẩm *</Text>
        <TextInput
          style={styles.input}
          placeholder="Nhập tên sản phẩm"
          value={form.productName}
          onChangeText={(v) => setForm({ ...form, productName: v })}
        />

        <Text style={styles.label}>Mô tả</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Nhập mô tả sản phẩm"
          value={form.description}
          onChangeText={(v) => setForm({ ...form, description: v })}
          multiline
          numberOfLines={4}
        />

        <Text style={styles.label}>Giá *</Text>
        <TextInput
          style={styles.input}
          placeholder="Nhập giá"
          value={form.price}
          onChangeText={(v) => setForm({ ...form, price: v })}
          keyboardType="decimal-pad"
        />

        <Text style={styles.label}>Tồn kho *</Text>
        <TextInput
          style={styles.input}
          placeholder="Nhập số lượng tồn"
          value={form.stockQuantity}
          onChangeText={(v) => setForm({ ...form, stockQuantity: v })}
          keyboardType="numeric"
        />

        <Text style={styles.label}>Danh mục</Text>
        <TouchableOpacity
          style={styles.categoryBtn}
          onPress={() => setShowCategoryPicker(!showCategoryPicker)}
        >
          <Text style={styles.categoryText}>
            {categories.find((c) => c.categoryId === form.categoryId)
              ?.categoryName || "Chọn danh mục"}
          </Text>
          <Text style={styles.arrow}>{showCategoryPicker ? "▼" : "▶"}</Text>
        </TouchableOpacity>
        {showCategoryPicker && (
          <View style={styles.categoryList}>
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat.categoryId}
                style={styles.categoryItem}
                onPress={() => {
                  setForm({ ...form, categoryId: cat.categoryId });
                  setShowCategoryPicker(false);
                }}
              >
                <Text
                  style={[
                    styles.categoryItemText,
                    form.categoryId === cat.categoryId &&
                      styles.selectedCategory,
                  ]}
                >
                  {cat.categoryName}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <Text style={styles.label}>Link ảnh</Text>
        <TextInput
          style={styles.input}
          placeholder="Nhập URL ảnh sản phẩm"
          value={form.imageUrl}
          onChangeText={(v) => setForm({ ...form, imageUrl: v })}
        />

        <TouchableOpacity
          style={[styles.btn, loading && styles.btnDisabled]}
          onPress={handleUpdate}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.btnText}>Cập nhật sản phẩm</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, paddingBottom: 32 },
  backText: {
    color: "#2563EB",
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 24,
  },
  label: { fontSize: 14, fontWeight: "600", color: "#374151", marginBottom: 8 },
  input: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginBottom: 16,
    fontSize: 14,
    color: "#111827",
  },
  textArea: { height: 100, textAlignVertical: "top" },
  categoryBtn: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginBottom: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  categoryText: { fontSize: 14, color: "#111827" },
  arrow: { color: "#6B7280", fontSize: 12 },
  categoryList: {
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginBottom: 16,
    maxHeight: 200,
  },
  categoryItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  categoryItemText: { fontSize: 14, color: "#111827" },
  selectedCategory: { color: "#2563EB", fontWeight: "700" },
  btn: {
    backgroundColor: "#2563EB",
    borderRadius: 10,
    padding: 14,
    alignItems: "center",
    marginTop: 8,
  },
  btnDisabled: { opacity: 0.6 },
  btnText: { color: "#fff", fontWeight: "700", fontSize: 16 },
});
