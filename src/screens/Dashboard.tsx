import React, { useEffect, useState } from "react";
import { View, Text, Button, FlatList, TouchableOpacity } from "react-native";
import { listPrescriptions, deletePrescription, Rx } from "../services/rx";
import { scheduleRefillReminder } from "../lib/notify";

export default function Dashboard({ onAdd, onEdit }: { onAdd: () => void; onEdit: (rx: Rx) => void }) {
  const [items, setItems] = useState<Rx[]>([]);
  const [loading, setLoading] = useState(true);
  async function load() {
    setLoading(true);
    try { setItems(await listPrescriptions()); } finally { setLoading(false); }
  }
  useEffect(() => { load(); }, []);

  async function schedule(rx: Rx) {
    if (rx.next_refill_date) {
      await scheduleRefillReminder(new Date(rx.next_refill_date), rx.name);
      alert("Local reminder scheduled.");
    } else {
      alert("Set a next_refill_date first.");
    }
  }

  if (loading) return <View style={{ padding: 24 }}><Text>Loading…</Text></View>;

  return (
    <View style={{ padding: 24, gap: 12, flex: 1 }}>
      <Text style={{ fontSize: 22, fontWeight: "600" }}>Your prescriptions</Text>
      <Button title="Add prescription" onPress={onAdd} />
      {items.length === 0 ? (
        <Text style={{ marginTop: 12 }}>No prescriptions yet.</Text>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(x) => x.id}
          renderItem={({ item }) => (
            <View style={{ padding: 12, borderWidth: 1, borderRadius: 8, marginVertical: 6 }}>
              <TouchableOpacity onPress={() => onEdit(item)}>
                <Text style={{ fontWeight: "600" }}>{item.name}</Text>
                <Text>{item.dosage ?? ""} • {item.frequency ?? ""}</Text>
                <Text>Next refill: {item.next_refill_date ?? "—"}</Text>
              </TouchableOpacity>
              <View style={{ flexDirection: "row", gap: 8, marginTop: 8 }}>
                <Button title="Schedule reminder" onPress={() => schedule(item)} />
                <Button title="Delete" color="#b00020" onPress={async () => { await deletePrescription(item.id); await load(); }} />
              </View>
            </View>
          )}
        />
      )}
      <Button title="Reload" onPress={load} />
    </View>
  );
}
