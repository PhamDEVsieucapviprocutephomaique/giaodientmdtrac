import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { useAuthStore } from "../../store/authStore";
import { logout as logoutApi } from "../../api/authApi";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ProfileScreen({ navigation }) {
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    const refreshToken = await AsyncStorage.getItem("refreshToken");
    if (refreshToken) await logoutApi({ refreshToken }).catch(() => {});
    await logout();
    navigation.replace("Auth");
  };

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.notLoggedIn}>
          <Text style={styles.logo}>👤</Text>
          <Text style={styles.title}>Tài khoản</Text>
          <Text style={styles.subtitle}>Đăng nhập để xem thông tin</Text>
          <TouchableOpacity
            style={styles.loginBtn}
            onPress={() => navigation.navigate("Auth")}
          >
            <Text style={styles.loginBtnText}>Đăng nhập</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const isSeller = user.roles?.some(
    (r) => r === "ROLE_SELLER" || r === "SELLER",
  );
  const isAdmin = user.roles?.some((r) => r === "ROLE_ADMIN" || r === "ADMIN");

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {user.username?.[0]?.toUpperCase()}
          </Text>
        </View>
        <Text style={styles.userName}>{user.username}</Text>
        <Text style={styles.userRole}>
          {user.roles?.join(" • ").replace(/ROLE_/g, "")}
        </Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>📋 Thông tin tài khoản</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Username:</Text>
            <Text style={styles.infoValue}>{user.username}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Vai trò:</Text>
            <Text style={styles.infoValue}>
              {user.roles?.join(", ").replace(/ROLE_/g, "")}
            </Text>
          </View>
        </View>

        {isSeller && (
          <TouchableOpacity
            style={[styles.actionBtn, styles.sellerBtn]}
            onPress={() => navigation.navigate("SellerHome")}
          >
            <Text style={styles.actionBtnText}>📦 Quản lý sản phẩm</Text>
          </TouchableOpacity>
        )}

        {isAdmin && (
          <TouchableOpacity
            style={[styles.actionBtn, styles.adminBtn]}
            onPress={() => navigation.navigate("AdminHome")}
          >
            <Text style={styles.actionBtnText}>⚙️ Quản trị hệ thống</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[styles.actionBtn, styles.logoutBtn]}
          onPress={handleLogout}
        >
          <Text style={styles.actionBtnText}>🚪 Đăng xuất</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFC" },
  scrollContent: {
    alignItems: "center",
    paddingTop: 30,
    paddingBottom: 40,
    paddingHorizontal: 20,
  },
  notLoggedIn: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  logo: { fontSize: 60, marginBottom: 16 },
  title: { fontSize: 24, fontWeight: "700", color: "#1E293B", marginBottom: 8 },
  subtitle: {
    fontSize: 14,
    color: "#64748B",
    marginBottom: 24,
    textAlign: "center",
  },
  loginBtn: {
    backgroundColor: "#2563EB",
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
  },
  loginBtnText: { color: "#fff", fontWeight: "700", fontSize: 16 },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#2563EB",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  avatarText: { color: "#fff", fontSize: 40, fontWeight: "700" },
  userName: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1E293B",
    marginBottom: 4,
  },
  userRole: { fontSize: 13, color: "#64748B", marginBottom: 24 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 18,
    width: "100%",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1E293B",
    marginBottom: 14,
  },
  infoRow: { flexDirection: "row", marginBottom: 10 },
  infoLabel: { fontSize: 14, color: "#64748B", width: 90 },
  infoValue: { fontSize: 14, color: "#1E293B", fontWeight: "500", flex: 1 },
  actionBtn: {
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
    width: "100%",
    marginBottom: 12,
  },
  sellerBtn: { backgroundColor: "#10B981" },
  adminBtn: { backgroundColor: "#8B5CF6" },
  logoutBtn: { backgroundColor: "#EF4444" },
  actionBtnText: { color: "#fff", fontWeight: "700", fontSize: 16 },
});
