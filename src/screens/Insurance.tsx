import React, { useState } from "react";
import { View, Text } from "react-native";
import { Button, TextInput, Card } from "../theme/components";
import { tokens } from "../theme/tokens";
import { insertInsurance } from "../services/insurance";

export default function Insurance({ onBack }: { onBack: () => void }) {
  const [provider, setProvider] = useState("");
  const [policyNumber, setPolicyNumber] = useState("");
  const [coverageDetails, setCoverageDetails] = useState("");
  const [err, setErr] = useState<string | null>(null);

  async function save() {
    try {
      setErr(null);
      await insertInsurance({
        provider,
        policy_number: policyNumber,
        coverage_details: coverageDetails,
      });
      onBack();
    } catch (e: any) {
      setErr(e.message ?? String(e));
    }
  }

  return (
    <View style={{ padding: tokens.space(3) }}>
      <Card style={{ gap: tokens.space(1.5) }}>
        <Text style={{ fontSize: 18, fontWeight: "600" }}>Insurance</Text>
        <TextInput
          placeholder="Provider"
          value={provider}
          onChangeText={setProvider}
        />
        <TextInput
          placeholder="Policy number"
          value={policyNumber}
          onChangeText={setPolicyNumber}
        />
        <TextInput
          placeholder="Coverage details"
          value={coverageDetails}
          onChangeText={setCoverageDetails}
        />
        {err && <Text style={{ color: tokens.color.danger }}>{err}</Text>}
        <Button title="Save" onPress={save} />
        <Button title="Back" onPress={onBack} />
      </Card>
    </View>
  );
}

