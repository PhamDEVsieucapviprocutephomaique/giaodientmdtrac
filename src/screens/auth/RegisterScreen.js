import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { register } from "../../api/authApi";

export default function RegisterScreen({ navigation }) {
  const [form, setForm] = useState({
    username: "",
    password: "",
    email: "",
    fullName: "",
    phone: "",
  });

  const handleRegister = async () => {
    try {
      await register(form);
      Alert.alert("Thành công", "Đăng ký thành công!", [
        { text: "OK", onPress: () => navigation.replace("Login") },
      ]);
    } catch (e) {
      Alert.alert("Lỗi", e.response?.data?.message || "Đăng ký thất bại");
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F9FAFB" }}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Đăng ký tài khoản</Text>
        {[
          ["username", "Tên đăng nhập"],
          ["password", "Mật khẩu"],
          ["email", "Email"],
          ["fullName", "Họ và tên"],
          ["phone", "Số điện thoại"],
        ].map(([key, label]) => (
          <TextInput
            key={key}
            style={styles.input}
            placeholder={label}
            value={form[key]}
            onChangeText={(v) => setForm({ ...form, [key]: v })}
            secureTextEntry={key === "password"}
            autoCapitalize="none"
          />
        ))}
        <TouchableOpacity style={styles.btn} onPress={handleRegister}>
          <Text style={styles.btnText}>Đăng ký</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.replace("Login")}>
          <Text style={styles.link}>Đã có tài khoản? Đăng nhập</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 24, paddingTop: 48 },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 24,
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
