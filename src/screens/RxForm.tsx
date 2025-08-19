import React, { useState } from "react";
import { View, Text } from "react-native";
import { insertPrescription, updatePrescription, Rx } from "../services/rx";
import { Button, TextInput, Card } from "../theme/components";
import { tokens } from "../theme/tokens";

export default function RxForm({
  initial,
  onSaved,
}: {
  initial?: Rx;
  onSaved: () => void;
}) {
  const [name, setName] = useState(initial?.name ?? "");
  const [dosage, setDosage] = useState(initial?.dosage ?? "");
  const [frequency, setFrequency] = useState(initial?.frequency ?? "");
  const [nextRefill, setNextRefill] = useState(initial?.next_refill_date ?? "");
  const [notes, setNotes] = useState(initial?.notes ?? "");
  const [err, setErr] = useState<string | null>(null);

  async function save() {
    try {
      setErr(null);
      const payload = {
        name,
        dosage,
        frequency,
        next_refill_date: nextRefill || null,
        notes,
      };
      if (initial) await updatePrescription(initial.id, payload);
      else await insertPrescription(payload);
      onSaved();
    } catch (e: any) {
      setErr(e.message ?? String(e));
    }
  }

  return (
    <View style={{ padding: tokens.space(3) }}>
      <Card style={{ gap: tokens.space(1.5) }}>
        <Text style={{ fontSize: 18, fontWeight: "600" }}>
          {initial ? "Edit" : "Add"} prescription
        </Text>
        <TextInput placeholder="Name *" value={name} onChangeText={setName} />
        <TextInput
          placeholder="Dosage"
          value={dosage ?? ""}
          onChangeText={setDosage}
        />
        <TextInput
          placeholder="Frequency"
          value={frequency ?? ""}
          onChangeText={setFrequency}
        />
        <TextInput
          placeholder="Next refill date (YYYY-MM-DD)"
          value={nextRefill ?? ""}
          onChangeText={setNextRefill}
        />
        <TextInput
          placeholder="Notes"
          value={notes ?? ""}
          onChangeText={setNotes}
        />
        {err && <Text style={{ color: tokens.color.danger }}>{err}</Text>}
        <Button title="Save" onPress={save} />
      </Card>
    </View>
  );
}
