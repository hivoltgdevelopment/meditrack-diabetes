import React, { useState } from "react";
import { View, Text } from "react-native";
import { insertPrescription, updatePrescription, Rx } from "../services/rx";
import { isNameValid, isDateValid } from "../services/validation";
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

  const [touchedName, setTouchedName] = useState(false);
  const [touchedDate, setTouchedDate] = useState(false);

  const nameError = isNameValid(name) ? "" : "Name is required";
  const dateError = isDateValid(nextRefill) ? "" : "Date must be YYYY-MM-DD";

  async function save() {
    setTouchedName(true);
    setTouchedDate(true);
    if (nameError || dateError) return;
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
        <TextInput
          placeholder="Name *"
          value={name}
          onChangeText={setName}
          onBlur={() => setTouchedName(true)}
        />
        <Text
          style={{
            color:
              nameError && touchedName
                ? tokens.color.danger
                : tokens.color.text,
            fontSize: 12,
          }}
        >
          {nameError && touchedName ? nameError : "Required"}
        </Text>
        <TextInput
          placeholder="Dosage"
          value={dosage ?? ""}
          onChangeText={setDosage}
        />
        <Text style={{ color: tokens.color.text, fontSize: 12 }}>Optional</Text>
        <TextInput
          placeholder="Frequency"
          value={frequency ?? ""}
          onChangeText={setFrequency}
        />
        <Text style={{ color: tokens.color.text, fontSize: 12 }}>Optional</Text>
        <TextInput
          placeholder="Next refill date (YYYY-MM-DD)"
          value={nextRefill ?? ""}
          onChangeText={setNextRefill}
          onBlur={() => setTouchedDate(true)}
        />
        <Text
          style={{
            color:
              dateError && touchedDate
                ? tokens.color.danger
                : tokens.color.text,
            fontSize: 12,
          }}
        >
          {dateError && touchedDate ? dateError : "YYYY-MM-DD"}
        </Text>
        <TextInput
          placeholder="Notes"
          value={notes ?? ""}
          onChangeText={setNotes}
        />
        <Text style={{ color: tokens.color.text, fontSize: 12 }}>Optional</Text>
        {err && <Text style={{ color: tokens.color.danger }}>{err}</Text>}
        <Button
          title="Save"
          onPress={save}
          disabled={!!(nameError || dateError)}
        />
      </Card>
    </View>
  );
}
