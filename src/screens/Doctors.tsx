import React, { useEffect, useState } from "react";
import { View, Text, FlatList } from "react-native";
import { Button, Card } from "../theme/components";
import { tokens } from "../theme/tokens";
import { listDoctors, Doctor } from "../services/doctors";

export default function Doctors({ onBack }: { onBack: () => void }) {
  const [items, setItems] = useState<Doctor[]>([]);

  async function load() {
    setItems(await listDoctors());
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <View style={{ padding: tokens.space(3), flex: 1 }}>
      <Text style={{ fontSize: 22, fontWeight: "600" }}>Doctors</Text>
      <FlatList
        data={items}
        keyExtractor={(x) => x.id}
        renderItem={({ item }) => (
          <Card style={{ marginVertical: tokens.space(0.75) }}>
            <Text style={{ fontWeight: "600" }}>
              {item.first_name ?? ""} {item.last_name ?? ""}
            </Text>
            <Text>{item.email}</Text>
          </Card>
        )}
      />
      <Button title="Back" onPress={onBack} />
    </View>
  );
}
