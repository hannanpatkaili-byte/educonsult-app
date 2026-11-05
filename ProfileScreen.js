import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useAuth } from "../context/AuthContext";

export default function ProfileScreen({ navigation }) {
  const { user, logout } = useAuth();

  if (!user) {
    return (
      <View style={styles.center}>
        <Text style={styles.infoText}>You're not logged in.</Text>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Login")}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("Register")}>
          <Text style={styles.link}>Create an account</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{user.name?.[0]?.toUpperCase() || "?"}</Text>
      </View>
      <Text style={styles.name}>{user.name}</Text>
      <Text style={styles.email}>{user.email}</Text>
      <Text style={styles.role}>{user.role}</Text>

      <TouchableOpacity style={styles.logoutButton} onPress={logout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", paddingTop: 60, backgroundColor: "#fff" },
  center: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  infoText: { fontSize: 15, color: "#666", marginBottom: 16 },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#2563eb",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  avatarText: { color: "#fff", fontSize: 28, fontWeight: "bold" },
  name: { fontSize: 20, fontWeight: "700" },
  email: { fontSize: 14, color: "#666", marginTop: 2 },
  role: {
    fontSize: 12,
    color: "#2563eb",
    textTransform: "uppercase",
    marginTop: 6,
    fontWeight: "600",
  },
  button: {
    backgroundColor: "#2563eb",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 32,
    marginTop: 10,
  },
  buttonText: { color: "#fff", fontWeight: "600" },
  link: { color: "#2563eb", marginTop: 14 },
  logoutButton: {
    marginTop: 30,
    borderWidth: 1,
    borderColor: "#dc2626",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 32,
  },
  logoutText: { color: "#dc2626", fontWeight: "600" },
});
