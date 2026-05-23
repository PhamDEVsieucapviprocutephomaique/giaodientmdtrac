import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
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

  if (!user)
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Tài khoản</Text>
        <Text style={styles.subtitle}>
          Đăng nhập để xem thông tin tài khoản
        </Text>
        <TouchableOpacity
          style={styles.btn}
          onPress={() => navigation.navigate("Auth")}
        >
          <Text style={styles.btnText}>Đăng nhập</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>
          {user.username?.[0]?.toUpperCase()}
        </Text>
      </View>
      <Text style={styles.title}>{user.username}</Text>
      <Text style={styles.role}>{user.roles?.join(" • ")}</Text>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Thông tin tài khoản</Text>
        <Text style={styles.cardText}>Username: {user.username}</Text>
        <Text style={styles.cardText}>Vai trò: {user.roles?.join(", ")}</Text>
      </View>
      <TouchableOpacity
        style={[styles.btn, { backgroundColor: "#EF4444" }]}
        onPress={handleLogout}
      >
        <Text style={styles.btnText}>Đăng xuất</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    padding: 24,
    alignItems: "center",
    paddingTop: 48,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#2563EB",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  avatarText: { color: "#fff", fontSize: 32, fontWeight: "700" },
  title: { fontSize: 22, fontWeight: "700", color: "#111827", marginBottom: 4 },
  subtitle: { color: "#6B7280", marginBottom: 24 },
  role: { fontSize: 13, color: "#6B7280", marginBottom: 24 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 16,
    width: "100%",
    marginBottom: 24,
    elevation: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 12,
  },
  cardText: { fontSize: 14, color: "#374151", marginBottom: 6 },
  btn: {
    backgroundColor: "#2563EB",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    width: "100%",
    marginBottom: 12,
  },
  btnText: { color: "#fff", fontWeight: "700", fontSize: 16 },
});
