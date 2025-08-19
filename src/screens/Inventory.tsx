import React, { useEffect, useState } from "react";
import { View, Text, FlatList } from "react-native";
import { Button, Card } from "../theme/components";
import { tokens } from "../theme/tokens";
import { listInventory, InventoryItem } from "../services/inventory";
import { supabase } from "../lib/supabase";

export default function Inventory({ onBack }: { onBack: () => void }) {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [threshold, setThreshold] = useState<number>(5);

  async function load() {
    const [invRes, settingsRes] = await Promise.all([
      listInventory(),
      supabase
        .from("user_settings")
        .select("low_stock_days_threshold")
        .maybeSingle(),
    ]);
    setItems(invRes);
    if (settingsRes.data?.low_stock_days_threshold)
      setThreshold(settingsRes.data.low_stock_days_threshold);
  }

  useEffect(() => {
    load();
  }, []);

  function isLow(item: InventoryItem) {
    if (!item.expiration_date) return false;
    const diff =
      (new Date(item.expiration_date).getTime() - Date.now()) /
      (1000 * 60 * 60 * 24);
    return diff <= threshold;
  }

  return (
    <View style={{ padding: tokens.space(3), flex: 1 }}>
      <Text style={{ fontSize: 22, fontWeight: "600" }}>Inventory</Text>
      <FlatList
        data={items}
        keyExtractor={(x) => x.id}
        renderItem={({ item }) => (
          <Card
            style={{
              marginVertical: tokens.space(0.75),
              borderColor: isLow(item)
                ? tokens.color.danger
                : tokens.color.surfaceAlt,
            }}
          >
            <Text style={{ fontWeight: "600" }}>
              {item.prescriptions?.name ?? "—"}
            </Text>
            <Text>Lot: {item.lot_number ?? "—"}</Text>
            <Text>Expires: {item.expiration_date ?? "—"}</Text>
            <Text>Qty: {item.quantity}</Text>
          </Card>
        )}
      />
      <Button title="Back" onPress={onBack} />
    </View>
  );
}
