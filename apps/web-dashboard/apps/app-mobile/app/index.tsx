import React, { useEffect } from "react";
import { View, Text, FlatList } from "react-native";
import { usePrescriptions } from "../src/hooks/usePrescriptions";
import { registerPushToken } from "../src/api/notifications";
import { Link } from "expo-router";

export default function HomeScreen() {
  const { data, loading, error } = usePrescriptions();

  useEffect(() => {
    registerPushToken().catch(() => {});
  }, []);

  return (
    <View style={{ padding: 16, gap: 12 }}>
      <Text style={{ fontSize: 22, fontWeight: "600" }}>Your prescriptions</Text>
      {loading && <Text>Loading</Text>}
      {error && <Text style={{ color: "red" }}>{error}</Text>}
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={{ paddingVertical: 8 }}>
            <Text style={{ fontWeight: "500" }}>{item.name}</Text>
            <Text>Remaining: {item.remaining_quantity}</Text>
          </View>
        )}
        ListEmptyComponent={!loading ? <Text>No prescriptions yet.</Text> : null}
      />
      <Link href="/add" style={{ color: "blue" }}>+ Add prescription</Link>
      <Link href="/inventory" style={{ color: "blue" }}>Inventory</Link>
      <Link href="/reminders" style={{ color: "blue" }}>Reminders</Link>
    </View>
  );
}
