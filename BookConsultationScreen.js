import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from "react-native";
import { bookConsultation } from "../../api/consultations";

const MODES = ["chat", "audio", "video"];

export default function BookConsultationScreen({ route, navigation }) {
  const { doctor } = route.params;
  const [date, setDate] = useState(""); // YYYY-MM-DD
  const [time, setTime] = useState(""); // HH:MM (24hr)
  const [mode, setMode] = useState("chat");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  const handleBook = async () => {
    if (!date || !time) {
      Alert.alert("Missing info", "Please enter date (YYYY-MM-DD) and time (HH:MM)");
      return;
    }

    const scheduledAt = `${date} ${time}:00`;

    setLoading(true);
    try {
      await bookConsultation({ doctorId: doctor.id, scheduledAt, mode, reason });
      Alert.alert("Booked!", "Your consultation request has been sent.", [
        { text: "OK", onPress: () => navigation.navigate("MyConsultations") },
      ]);
    } catch (e) {
      Alert.alert("Could not book", e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 20 }}>
      <Text style={styles.title}>Book with {doctor.name}</Text>
      <Text style={styles.subtitle}>{doctor.specialization || "General"}</Text>

      <Text style={styles.label}>Date (YYYY-MM-DD)</Text>
      <TextInput
        style={styles.input}
        placeholder="2026-11-10"
        value={date}
        onChangeText={setDate}
      />

      <Text style={styles.label}>Time, 24-hour (HH:MM)</Text>
      <TextInput
        style={styles.input}
        placeholder="14:30"
        value={time}
        onChangeText={setTime}
      />

      <Text style={styles.label}>Mode</Text>
      <View style={styles.modeRow}>
        {MODES.map((m) => (
          <TouchableOpacity
            key={m}
            style={[styles.modeButton, mode === m && styles.modeButtonActive]}
            onPress={() => setMode(m)}
          >
            <Text style={mode === m ? styles.modeTextActive : styles.modeText}>{m}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Reason (optional)</Text>
      <TextInput
        style={[styles.input, { height: 80 }]}
        placeholder="Briefly describe why you're booking..."
        value={reason}
        onChangeText={setReason}
        multiline
      />

      <TouchableOpacity style={styles.button} onPress={handleBook} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? "Booking..." : "Confirm Booking"}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  title: { fontSize: 20, fontWeight: "bold" },
  subtitle: { fontSize: 14, color: "#2563eb", marginBottom: 20 },
  label: { fontSize: 13, color: "#555", marginBottom: 6, marginTop: 10 },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 12,
    fontSize: 15,
  },
  modeRow: { flexDirection: "row", gap: 8 },
  modeButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 10,
    alignItems: "center",
  },
  modeButtonActive: { backgroundColor: "#2563eb", borderColor: "#2563eb" },
  modeText: { color: "#333", textTransform: "capitalize" },
  modeTextActive: { color: "#fff", fontWeight: "600", textTransform: "capitalize" },
  button: {
    backgroundColor: "#2563eb",
    borderRadius: 10,
    padding: 16,
    alignItems: "center",
    marginTop: 24,
    marginBottom: 40,
  },
  buttonText: { color: "#fff", fontWeight: "600", fontSize: 16 },
});
