import React, { useEffect, useState } from "react";
import { View, Text, FlatList } from "react-native";
import { Button, Card } from "../theme/components";
import { tokens } from "../theme/tokens";
import { listPharmacies, Pharmacy } from "../services/pharmacies";

export default function Pharmacies({ onBack }: { onBack: () => void }) {
  const [items, setItems] = useState<Pharmacy[]>([]);

  async function load() {
    setItems(await listPharmacies());
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <View style={{ padding: tokens.space(3), flex: 1 }}>
      <Text style={{ fontSize: 22, fontWeight: "600" }}>Pharmacies</Text>
      <FlatList
        data={items}
        keyExtractor={(x) => x.id}
        renderItem={({ item }) => (
          <Card style={{ marginVertical: tokens.space(0.75) }}>
            <Text style={{ fontWeight: "600" }}>{item.name}</Text>
            <Text>{item.address ?? "—"}</Text>
          </Card>
        )}
      />
      <Button title="Back" onPress={onBack} />
    </View>
  );
}
