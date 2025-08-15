import React from "react";
import { View, Text } from "react-native";
import { PrescriptionForm } from "../src/components/PrescriptionForm";
import { useRouter } from "expo-router";

export default function AddScreen() {
  const router = useRouter();
  return (
    <View style={{ padding: 16, gap: 12 }}>
      <Text style={{ fontSize: 20, fontWeight: "600" }}>Add prescription</Text>
      <PrescriptionForm onSaved={() => router.back()} />
    </View>
  );
}
