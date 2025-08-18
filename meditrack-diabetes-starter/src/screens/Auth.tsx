
import React, { useState } from "react";
import { View, TextInput, Button, Text } from "react-native";
import { supabase } from "../lib/supabase";

export default function AuthScreen({ onAuthed }: { onAuthed: () => void }) {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [mode, setMode] = useState<"in" | "up">("in");
  const [err, setErr] = useState<string | null>(null);

  async function go() {
    setErr(null);
    const fn = mode === "in" ? supabase.auth.signInWithPassword : supabase.auth.signUp;
    const { error } = await fn({ email, password: pw });
    if (error) setErr(error.message);
    else onAuthed();
  }

  return (
    <View style={{ padding: 24, gap: 12 }}>
      <Text style={{ fontSize: 24, fontWeight: "600" }}>MediTrack Diabetes</Text>
      <TextInput placeholder="Email" autoCapitalize="none" onChangeText={setEmail} value={email} />
      <TextInput placeholder="Password" secureTextEntry onChangeText={setPw} value={pw} />
      {err && <Text style={{ color: "red" }}>{err}</Text>}
      <Button title={mode === "in" ? "Sign In" : "Sign Up"} onPress={go} />
      <Button title={mode === "in" ? "Need an account? Sign Up" : "Have an account? Sign In"} onPress={() => setMode(mode === "in" ? "up" : "in")} />
    </View>
  );
}
