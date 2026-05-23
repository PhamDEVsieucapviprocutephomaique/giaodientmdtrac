import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  SafeAreaView,
} from "react-native";
import { login } from "../../api/authApi";
import { useAuthStore } from "../../store/authStore";

export default function LoginScreen({ navigation }) {
  const [loginKey, setLoginKey] = useState("");
  const [password, setPassword] = useState("");
  const setAuth = useAuthStore((s) => s.setAuth);

  const handleLogin = async () => {
    try {
      const res = await login({ loginKey, password });
      const { token, refreshToken, username, roles } = res.data.result;
      await setAuth(token, username, roles, refreshToken);
      navigation.replace("Main");
    } catch (e) {
      Alert.alert("Lỗi", e.response?.data?.message || "Đăng nhập thất bại");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.logo}>🛍 Marketplace Pro</Text>
      <Text style={styles.title}>Đăng nhập</Text>
      <TextInput
        style={styles.input}
        placeholder="Username / Email / SĐT"
        value={loginKey}
        onChangeText={setLoginKey}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Mật khẩu"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity style={styles.btn} onPress={handleLogin}>
        <Text style={styles.btnText}>Đăng nhập</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("Register")}>
        <Text style={styles.link}>Chưa có tài khoản? Đăng ký</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    padding: 24,
    justifyContent: "center",
  },
  logo: {
    fontSize: 28,
    fontWeight: "800",
    color: "#2563EB",
    textAlign: "center",
    marginBottom: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 24,
    textAlign: "center",
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginBottom: 14,
    fontSize: 15,
  },
  btn: {
    backgroundColor: "#2563EB",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginBottom: 16,
  },
  btnText: { color: "#fff", fontWeight: "700", fontSize: 16 },
  link: { color: "#2563EB", textAlign: "center", fontSize: 14 },
});
