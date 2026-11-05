import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TextInput,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { getMyConsultations, updateConsultation } from "../../api/consultations";
import { useAuth } from "../../context/AuthContext";

const STATUS_COLORS = {
  pending: "#f59e0b",
  confirmed: "#2563eb",
  completed: "#16a34a",
  cancelled: "#dc2626",
};

export default function MyConsultationsScreen() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notesDraft, setNotesDraft] = useState({});

  const load = async () => {
    try {
      const data = await getMyConsultations();
      setItems(data);
    } catch (e) {
      console.warn(e.message);
    }
  };

  useFocusEffect(
    useCallback(() => {
      if (!user) {
        setLoading(false);
        return;
      }
      setLoading(true);
      load().finally(() => setLoading(false));
    }, [user])
  );

  const cancelBooking = (id) => {
    Alert.alert("Cancel booking?", "This cannot be undone.", [
      { text: "No" },
      {
        text: "Yes, cancel",
        style: "destructive",
        onPress: async () => {
          try {
            await updateConsultation(id, { status: "cancelled" });
            load();
          } catch (e) {
            Alert.alert("Error", e.message);
          }
        },
      },
    ]);
  };

  const doctorAction = async (id, status) => {
    try {
      await updateConsultation(id, { status, notes: notesDraft[id] });
      load();
    } catch (e) {
      Alert.alert("Error", e.message);
    }
  };

  if (!user) {
    return (
      <View style={styles.center}>
        <Text>Please login to see your consultations.</Text>
      </View>
    );
  }

  if (loading) return <ActivityIndicator style={{ marginTop: 40 }} size="large" />;

  return (
    <FlatList
      style={styles.container}
      data={items}
      keyExtractor={(item) => String(item.id)}
      contentContainerStyle={{ padding: 16 }}
      ListEmptyComponent={<Text style={styles.empty}>No consultations yet.</Text>}
      renderItem={({ item }) => {
        const otherParty = user.role === "doctor" ? item.patient_name : item.doctor_name;
        return (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.name}>{otherParty}</Text>
              <Text style={[styles.status, { color: STATUS_COLORS[item.status] }]}>
                {item.status}
              </Text>
            </View>
            <Text style={styles.meta}>{item.scheduled_at} · {item.mode}</Text>
            {item.reason && <Text style={styles.reason}>Reason: {item.reason}</Text>}
            {item.notes && <Text style={styles.notes}>Notes: {item.notes}</Text>}

            {user.role === "doctor" && item.status !== "cancelled" && item.status !== "completed" && (
              <View style={{ marginTop: 10 }}>
                <TextInput
                  style={styles.notesInput}
                  placeholder="Add notes..."
                  value={notesDraft[item.id] ?? item.notes ?? ""}
                  onChangeText={(t) => setNotesDraft((d) => ({ ...d, [item.id]: t }))}
                />
                <View style={styles.actionRow}>
                  {item.status === "pending" && (
                    <TouchableOpacity
                      style={styles.actionBtn}
                      onPress={() => doctorAction(item.id, "confirmed")}
                    >
                      <Text style={styles.actionText}>Confirm</Text>
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity
                    style={[styles.actionBtn, { backgroundColor: "#16a34a" }]}
                    onPress={() => doctorAction(item.id, "completed")}
                  >
                    <Text style={styles.actionText}>Mark Done</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {user.role !== "doctor" && item.status !== "cancelled" && item.status !== "completed" && (
              <TouchableOpacity style={styles.cancelBtn} onPress={() => cancelBooking(item.id)}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
            )}
          </View>
        );
      }}
    />
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
  cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  name: { fontSize: 16, fontWeight: "600" },
  status: { fontSize: 12, fontWeight: "600", textTransform: "uppercase" },
  meta: { fontSize: 13, color: "#666", marginTop: 4 },
  reason: { fontSize: 13, color: "#444", marginTop: 6 },
  notes: { fontSize: 13, color: "#444", marginTop: 4, fontStyle: "italic" },
  notesInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 8,
    fontSize: 13,
    marginBottom: 8,
  },
  actionRow: { flexDirection: "row", gap: 8 },
  actionBtn: { backgroundColor: "#2563eb", borderRadius: 8, paddingVertical: 8, paddingHorizontal: 14 },
  actionText: { color: "#fff", fontSize: 13, fontWeight: "600" },
  cancelBtn: { marginTop: 10, alignSelf: "flex-start" },
  cancelText: { color: "#dc2626", fontSize: 13, fontWeight: "600" },
  empty: { textAlign: "center", marginTop: 40, color: "#999" },
});
