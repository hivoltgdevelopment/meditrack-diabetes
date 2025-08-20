import React from "react";
import { View, Text } from "react-native";
import { Button } from "../theme/components";
import { tokens } from "../theme/tokens";

export default function Profile({
  onInsurance,
  onBack,
}: {
  onInsurance: () => void;
  onBack: () => void;
}) {
  return (
    <View style={{ padding: tokens.space(3), gap: tokens.space(1.5), flex: 1 }}>
      <Text style={{ fontSize: 22, fontWeight: "600" }}>Profile</Text>
      <Button title="Insurance" onPress={onInsurance} />
      <Button title="Back" onPress={onBack} />
    </View>
  );
}

