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
import { createPrescription } from "../../api/prescriptions";
import { useAuth } from "../../context/AuthContext";

const emptyMedicine = { name: "", dosage: "", frequency: "", duration: "", instructions: "" };

export default function CreatePrescriptionScreen({ navigation }) {
  const { user } = useAuth();
  const isDoctor = user?.role === "doctor";

  const [patientId, setPatientId] = useState("");
  const [patientAge, setPatientAge] = useState("");
  const [patientGender, setPatientGender] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [advice, setAdvice] = useState("");
  const [medicines, setMedicines] = useState([{ ...emptyMedicine }]);
  const [loading, setLoading] = useState(false);

  const updateMedicine = (index, field, value) => {
    setMedicines((list) => {
      const copy = [...list];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const addMedicine = () => setMedicines((list) => [...list, { ...emptyMedicine }]);
  const removeMedicine = (index) =>
    setMedicines((list) => list.filter((_, i) => i !== index));

  const handleSubmit = async () => {
    if (isDoctor && !patientId) {
      Alert.alert("Missing info", "Please enter the patient's user ID");
      return;
    }
    const validMedicines = medicines.filter((m) => m.name && m.dosage && m.frequency && m.duration);
    if (validMedicines.length === 0) {
      Alert.alert("Missing info", "Add at least one medicine with name, dosage, frequency and duration");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        type: isDoctor ? "doctor_issued" : "self_recorded",
        patient_id: isDoctor ? Number(patientId) : undefined,
        patient_age: patientAge ? Number(patientAge) : undefined,
        patient_gender: patientGender || undefined,
        diagnosis: diagnosis || undefined,
        advice: advice || undefined,
        medicines: validMedicines,
      };
      const result = await createPrescription(payload);
      Alert.alert("Created!", "Prescription saved successfully.", [
        {
          text: "View",
          onPress: () => navigation.replace("PrescriptionView", { id: result.id }),
        },
      ]);
    } catch (e) {
      Alert.alert("Could not create", e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 20 }}>
      <Text style={styles.title}>
        {isDoctor ? "New Prescription" : "New Personal Medicine Record"}
      </Text>
      {!isDoctor && (
        <Text style={styles.notice}>
          This is a personal log for your own reference, not an official medical prescription.
        </Text>
      )}

      {isDoctor && (
        <>
          <Text style={styles.label}>Patient User ID</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. 5"
            keyboardType="numeric"
            value={patientId}
            onChangeText={setPatientId}
          />
        </>
      )}

      <View style={styles.row}>
        <View style={{ flex: 1, marginRight: 8 }}>
          <Text style={styles.label}>Age</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={patientAge}
            onChangeText={setPatientAge}
          />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.label}>Gender</Text>
          <TextInput style={styles.input} value={patientGender} onChangeText={setPatientGender} />
        </View>
      </View>

      {isDoctor && (
        <>
          <Text style={styles.label}>Diagnosis</Text>
          <TextInput
            style={styles.input}
            value={diagnosis}
            onChangeText={setDiagnosis}
            multiline
          />
        </>
      )}

      <Text style={styles.sectionTitle}>Medicines</Text>
      {medicines.map((med, i) => (
        <View key={i} style={styles.medicineBlock}>
          <TextInput
            style={styles.input}
            placeholder="Medicine name"
            value={med.name}
            onChangeText={(v) => updateMedicine(i, "name", v)}
          />
          <View style={styles.row}>
            <TextInput
              style={[styles.input, { flex: 1, marginRight: 8 }]}
              placeholder="Dosage (e.g. 500mg)"
              value={med.dosage}
              onChangeText={(v) => updateMedicine(i, "dosage", v)}
            />
            <TextInput
              style={[styles.input, { flex: 1 }]}
              placeholder="Frequency"
              value={med.frequency}
              onChangeText={(v) => updateMedicine(i, "frequency", v)}
            />
          </View>
          <View style={styles.row}>
            <TextInput
              style={[styles.input, { flex: 1, marginRight: 8 }]}
              placeholder="Duration (e.g. 5 days)"
              value={med.duration}
              onChangeText={(v) => updateMedicine(i, "duration", v)}
            />
            <TextInput
              style={[styles.input, { flex: 1 }]}
              placeholder="Instructions"
              value={med.instructions}
              onChangeText={(v) => updateMedicine(i, "instructions", v)}
            />
          </View>
          {medicines.length > 1 && (
            <TouchableOpacity onPress={() => removeMedicine(i)}>
              <Text style={styles.removeText}>Remove</Text>
            </TouchableOpacity>
          )}
        </View>
      ))}

      <TouchableOpacity style={styles.addButton} onPress={addMedicine}>
        <Text style={styles.addButtonText}>+ Add another medicine</Text>
      </TouchableOpacity>

      <Text style={styles.label}>Advice (optional)</Text>
      <TextInput style={styles.input} value={advice} onChangeText={setAdvice} multiline />

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} disabled={loading}>
        <Text style={styles.submitText}>{loading ? "Saving..." : "Save Prescription"}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 6 },
  notice: {
    fontSize: 12,
    color: "#92400e",
    backgroundColor: "#fef3c7",
    padding: 10,
    borderRadius: 8,
    marginBottom: 16,
  },
  label: { fontSize: 13, color: "#555", marginBottom: 6, marginTop: 10 },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 12,
    fontSize: 14,
    marginBottom: 8,
  },
  row: { flexDirection: "row" },
  sectionTitle: { fontSize: 16, fontWeight: "600", marginTop: 16, marginBottom: 8 },
  medicineBlock: {
    backgroundColor: "#f9fafb",
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
  },
  removeText: { color: "#dc2626", fontSize: 13 },
  addButton: { alignSelf: "flex-start", marginBottom: 16 },
  addButtonText: { color: "#2563eb", fontWeight: "600" },
  submitButton: {
    backgroundColor: "#2563eb",
    borderRadius: 10,
    padding: 16,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 40,
  },
  submitText: { color: "#fff", fontWeight: "600", fontSize: 16 },
});
