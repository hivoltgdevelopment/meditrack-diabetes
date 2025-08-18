
import React, { useState } from "react";
import { View, TextInput, Button, Text } from "react-native";
import { insertPrescription, updatePrescription, Rx } from "../services/rx";

export default function RxForm({ initial, onSaved }: { initial?: Rx; onSaved: () => void }) {
  const [name, setName] = useState(initial?.name ?? "");
  const [dosage, setDosage] = useState(initial?.dosage ?? "");
  const [frequency, setFrequency] = useState(initial?.frequency ?? "");
  const [nextRefill, setNextRefill] = useState(initial?.next_refill_date ?? "");
  const [notes, setNotes] = useState(initial?.notes ?? "");
  const [err, setErr] = useState<string | null>(null);

  async function save() {
    try {
      setErr(null);
      const payload = { name, dosage, frequency, next_refill_date: nextRefill || null, notes };
      if (initial) await updatePrescription(initial.id, payload);
      else await insertPrescription(payload);
      onSaved();
    } catch (e: any) {
      setErr(e.message ?? String(e));
    }
  }

  return (
    <View style={{ padding: 24, gap: 12 }}>
      <Text style={{ fontSize: 18, fontWeight: "600" }}>{initial ? "Edit" : "Add"} prescription</Text>
      <TextInput placeholder="Name *" value={name} onChangeText={setName} />
      <TextInput placeholder="Dosage" value={dosage ?? ""} onChangeText={setDosage} />
      <TextInput placeholder="Frequency" value={frequency ?? ""} onChangeText={setFrequency} />
      <TextInput placeholder="Next refill date (YYYY-MM-DD)" value={nextRefill ?? ""} onChangeText={setNextRefill} />
      <TextInput placeholder="Notes" value={notes ?? ""} onChangeText={setNotes} />
      {err && <Text style={{ color: "red" }}>{err}</Text>}
      <Button title="Save" onPress={save} />
    </View>
  );
}
