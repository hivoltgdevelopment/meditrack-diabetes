import React, { useState } from "react";
import { View, TextInput, Button, Text } from "react-native";
import { supabase } from "../api/supabase";

export function PrescriptionForm({ onSaved }: { onSaved?: () => void }) {
  const [name, setName] = useState("");
  const [startingQty, setStartingQty] = useState("0");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function save() {
    setSaving(true);
    setError(null);
    const { data: u } = await supabase.auth.getUser();
    if (!u?.user) { setError("Please sign in first."); setSaving(false); return; }
    const payload = {
      user_id: u.user.id,
      name: name.trim(),
      category: "medication",
      remaining_quantity: Number(startingQty) || 0,
    };
    const { error } = await supabase.from("prescriptions").insert(payload);
    if (error) setError(error.message);
    setSaving(false);
    if (!error) {
      setName(""); setStartingQty("0");
      onSaved?.();
    }
  }

  return (
    <View style={{ gap: 8 }}>
      <Text>Name</Text>
      <TextInput
        value={name} onChangeText={setName}
        placeholder="Metformin" style={{ padding: 8, borderWidth: 1, borderRadius: 6 }}
      />
      <Text>Starting quantity</Text>
      <TextInput
        value={startingQty} onChangeText={setStartingQty}
        keyboardType="numeric" style={{ padding: 8, borderWidth: 1, borderRadius: 6 }}
      />
      {error ? <Text style={{ color: "red" }}>{error}</Text> : null}
      <Button title={saving ? "Saving..." : "Save"} onPress={save} disabled={saving || !name.trim()} />
    </View>
  );
}
