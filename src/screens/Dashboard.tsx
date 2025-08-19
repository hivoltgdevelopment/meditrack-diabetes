import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { Button, Card } from "../theme/components";
import { tokens } from "../theme/tokens";
import { listPrescriptions, deletePrescription, Rx } from "../services/rx";
import { scheduleRefillReminder } from "../lib/notify";

export default function Dashboard({
  onAdd,
  onEdit,
  onInventory,
}: {
  onAdd: () => void;
  onEdit: (rx: Rx) => void;
  onInventory: () => void;
}) {
  const [items, setItems] = useState<Rx[]>([]);
  const [loading, setLoading] = useState(true);
  async function load() {
    setLoading(true);
    try {
      setItems(await listPrescriptions());
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    load();
  }, []);

  async function schedule(rx: Rx) {
    if (rx.next_refill_date) {
      await scheduleRefillReminder(new Date(rx.next_refill_date), rx.name);
      alert("Local reminder scheduled.");
    } else {
      alert("Set a next_refill_date first.");
    }
  }

  if (loading)
    return (
      <View style={{ padding: tokens.space(3) }}>
        <Text>Loading…</Text>
      </View>
    );

  return (
    <View style={{ padding: tokens.space(3), gap: tokens.space(1.5), flex: 1 }}>
      <Text style={{ fontSize: 22, fontWeight: "600" }}>
        Your prescriptions
      </Text>
      <Button title="Add prescription" onPress={onAdd} />
      <Button title="Inventory" onPress={onInventory} />
      {items.length === 0 ? (
        <Text style={{ marginTop: tokens.space(1.5) }}>
          No prescriptions yet.
        </Text>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(x) => x.id}
          renderItem={({ item }) => (
            <Card style={{ marginVertical: tokens.space(0.75) }}>
              <TouchableOpacity onPress={() => onEdit(item)}>
                <Text style={{ fontWeight: "600" }}>{item.name}</Text>
                <Text>
                  {item.dosage ?? ""} • {item.frequency ?? ""}
                </Text>
                <Text>Next refill: {item.next_refill_date ?? "—"}</Text>
              </TouchableOpacity>
              <View
                style={{
                  flexDirection: "row",
                  gap: tokens.space(1),
                  marginTop: tokens.space(1),
                }}
              >
                <Button
                  title="Schedule reminder"
                  onPress={() => schedule(item)}
                />
                <Button
                  title="Delete"
                  style={{ backgroundColor: tokens.color.danger }}
                  onPress={async () => {
                    await deletePrescription(item.id);
                    await load();
                  }}
                />
              </View>
            </Card>
          )}
        />
      )}
      <Button title="Reload" onPress={load} />
    </View>
  );
}
