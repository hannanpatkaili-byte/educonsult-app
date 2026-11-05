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
import { getDoctors } from "../../api/consultations";
import { useAuth } from "../../context/AuthContext";

export default function DoctorListScreen({ navigation }) {
  const { user } = useAuth();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useFocusEffect(
    useCallback(() => {
      if (!user) {
        setLoading(false);
        return;
      }
      setLoading(true);
      getDoctors()
        .then(setDoctors)
        .catch((e) => setError(e.message))
        .finally(() => setLoading(false));
    }, [user])
  );

  if (!user) {
    return (
      <View style={styles.center}>
        <Text style={styles.infoText}>Please login to see available doctors.</Text>
      </View>
    );
  }

  if (loading) return <ActivityIndicator style={{ marginTop: 40 }} size="large" />;

  return (
    <FlatList
      style={styles.container}
      data={doctors}
      keyExtractor={(item) => String(item.id)}
      contentContainerStyle={{ padding: 16 }}
      ListEmptyComponent={
        <Text style={styles.empty}>
          {error || "No verified doctors available yet."}
        </Text>
      }
      renderItem={({ item }) => (
        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate("BookConsultation", { doctor: item })}
        >
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.specialization}>{item.specialization || "General"}</Text>
          {item.clinic_name && <Text style={styles.clinic}>{item.clinic_name}</Text>}
        </TouchableOpacity>
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f7f7f9" },
  center: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  infoText: { color: "#666", fontSize: 15, textAlign: "center" },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#eee",
  },
  name: { fontSize: 17, fontWeight: "600" },
  specialization: { fontSize: 13, color: "#2563eb", marginTop: 4 },
  clinic: { fontSize: 13, color: "#999", marginTop: 2 },
  empty: { textAlign: "center", marginTop: 40, color: "#999" },
});
