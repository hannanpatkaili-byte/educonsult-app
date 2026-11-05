import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { getMyPrescriptions } from "../../api/prescriptions";
import { useAuth } from "../../context/AuthContext";

export default function MyPrescriptionsScreen({ navigation }) {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      if (!user) {
        setLoading(false);
        return;
      }
      setLoading(true);
      getMyPrescriptions()
        .then(setItems)
        .catch((e) => console.warn(e.message))
        .finally(() => setLoading(false));
    }, [user])
  );

  if (!user) {
    return (
      <View style={styles.center}>
        <Text>Please login to see your prescriptions.</Text>
      </View>
    );
  }

  if (loading) return <ActivityIndicator style={{ marginTop: 40 }} size="large" />;

  return (
    <View style={styles.container}>
      <FlatList
        data={items}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={{ padding: 16 }}
        ListEmptyComponent={<Text style={styles.empty}>No prescriptions yet.</Text>}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate("PrescriptionView", { id: item.id })}
          >
            <Text style={styles.title}>
              {item.type === "self_recorded" ? "Personal Record" : `Prescribed by ${item.doctor_name || "Doctor"}`}
            </Text>
            {item.patient_name && item.doctor_name && (
              <Text style={styles.meta}>Patient: {item.patient_name}</Text>
            )}
            {item.diagnosis && <Text style={styles.meta}>{item.diagnosis}</Text>}
            <Text style={styles.date}>{new Date(item.created_at).toLocaleDateString()}</Text>
          </TouchableOpacity>
        )}
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate("CreatePrescription")}
      >
        <Text style={styles.fabText}>+ New</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f7f7f9" },
  center: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#eee",
  },
  title: { fontSize: 16, fontWeight: "600" },
  meta: { fontSize: 13, color: "#555", marginTop: 4 },
  date: { fontSize: 12, color: "#999", marginTop: 6 },
  empty: { textAlign: "center", marginTop: 40, color: "#999" },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 24,
    backgroundColor: "#2563eb",
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 20,
    elevation: 4,
  },
  fabText: { color: "#fff", fontWeight: "700" },
});
