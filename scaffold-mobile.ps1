# scaffold-mobile.ps1 — recreate app-mobile/src structure & basic screens

$ErrorActionPreference = "Stop"
$root = "apps/app-mobile"
if (-not (Test-Path $root)) { throw "Folder not found: $root" }

# 1) Create directories
$dirs = @(
    "$root/src",
    "$root/src/api",
    "$root/src/components",
    "$root/src/hooks",
    "$root/src/types",
    "$root/app",            # Expo Router pages
    "$root/assets"
)
$dirs | ForEach-Object { New-Item -ItemType Directory -Path $_ -Force | Out-Null }

# 2) Supabase client
@'
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.warn("Missing EXPO_PUBLIC_SUPABASE_URL or EXPO_PUBLIC_SUPABASE_ANON_KEY");
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
'@ | Set-Content "$root/src/api/supabase.ts" -Encoding UTF8

# 3) Notifications helper
@'
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import { Platform } from "react-native";
import { supabase } from "./supabase";

export async function registerPushToken() {
  const { status: existing } = await Notifications.getPermissionsAsync();
  let finalStatus = existing;
  if (existing !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  if (finalStatus !== "granted") return null;

  // Expo projectId required for EAS-enabled projects
  const projectId =
    // @ts-ignore
    Constants?.expoConfig?.extra?.eas?.projectId ||
    // @ts-ignore
    Constants?.easConfig?.projectId;

  const token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;

  const { data: u } = await supabase.auth.getUser();
  if (!u?.user) return token;

  await supabase.from("user_push_tokens").upsert({
    user_id: u.user.id,
    device_id: `${Platform.OS}-${Constants.deviceName ?? "unknown"}`,
    expo_push_token: token,
  });

  return token;
}
'@ | Set-Content "$root/src/api/notifications.ts" -Encoding UTF8

# 4) Types
@'
export type Prescription = {
  id: string;
  user_id: string;
  name: string;
  category: "medication" | "supply";
  dosage?: string | null;
  frequency?: string | null;
  remaining_quantity: number;
  created_at?: string;
};
'@ | Set-Content "$root/src/types/index.ts" -Encoding UTF8

# 5) Hook: prescriptions
@'
import { useEffect, useState } from "react";
import { supabase } from "../api/supabase";
import type { Prescription } from "../types";

export function usePrescriptions() {
  const [data, setData] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    const { data: userRes } = await supabase.auth.getUser();
    const userId = userRes?.user?.id;
    if (!userId) {
      setData([]);
      setLoading(false);
      return;
    }
    const { data: rows, error: err } = await supabase
      .from("prescriptions")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    if (err) setError(err.message);
    setData(rows ?? []);
    setLoading(false);
  }

  useEffect(() => {
    load();
    const ch = supabase
      .channel("rx-changes")
      .on("postgres_changes",
        { event: "*", schema: "public", table: "prescriptions" },
        () => load())
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, []);

  return { data, loading, error, reload: load };
}
'@ | Set-Content "$root/src/hooks/usePrescriptions.ts" -Encoding UTF8

# 6) Component: simple Add form
@'
import React, { useState } from "react";
import { View, TextInput, Button, Text } from "react-native";
import { supabase } from "../api/supabase";

export function PrescriptionForm({ onSaved }: { onSaved?: () => void }) {
  const [name, setName] = useState("");
  const [startingQty, setStartingQty] = useState("0");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function save() {
    setSaving(true);
    setError(null);
    const { data: u } = await supabase.auth.getUser();
    if (!u?.user) { setError("Please sign in first."); setSaving(false); return; }
    const payload = {
      user_id: u.user.id,
      name: name.trim(),
      category: "medication",
      remaining_quantity: Number(startingQty) || 0,
    };
    const { error } = await supabase.from("prescriptions").insert(payload);
    if (error) setError(error.message);
    setSaving(false);
    if (!error) {
      setName(""); setStartingQty("0");
      onSaved?.();
    }
  }

  return (
    <View style={{ gap: 8 }}>
      <Text>Name</Text>
      <TextInput
        value={name} onChangeText={setName}
        placeholder="Metformin" style={{ padding: 8, borderWidth: 1, borderRadius: 6 }}
      />
      <Text>Starting quantity</Text>
      <TextInput
        value={startingQty} onChangeText={setStartingQty}
        keyboardType="numeric" style={{ padding: 8, borderWidth: 1, borderRadius: 6 }}
      />
      {error ? <Text style={{ color: "red" }}>{error}</Text> : null}
      <Button title={saving ? "Saving..." : "Save"} onPress={save} disabled={saving || !name.trim()} />
    </View>
  );
}
'@ | Set-Content "$root/src/components/PrescriptionForm.tsx" -Encoding UTF8

# 7) Expo Router pages
@'
import { Stack } from "expo-router";

export default function RootLayout() {
  return <Stack screenOptions={{ headerTitle: "MediTrack Diabetes" }} />;
}
'@ | Set-Content "$root/app/_layout.tsx" -Encoding UTF8

@'
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
      {loading && <Text>Loading…</Text>}
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
'@ | Set-Content "$root/app/index.tsx" -Encoding UTF8

@'
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
'@ | Set-Content "$root/app/add.tsx" -Encoding UTF8

@'
import React from "react";
import { View, Text } from "react-native";

export default function InventoryScreen() {
  return (
    <View style={{ padding: 16 }}>
      <Text style={{ fontSize: 20, fontWeight: "600" }}>Inventory (stub)</Text>
      <Text>Adjust quantities and view lots — to be implemented.</Text>
    </View>
  );
}
'@ | Set-Content "$root/app/inventory.tsx" -Encoding UTF8

@'
import React from "react";
import { View, Text } from "react-native";

export default function RemindersScreen() {
  return (
    <View style={{ padding: 16 }}>
      <Text style={{ fontSize: 20, fontWeight: "600" }}>Reminders (stub)</Text>
      <Text>Days remaining + low-stock alerts — to be implemented.</Text>
    </View>
  );
}
'@ | Set-Content "$root/app/reminders.tsx" -Encoding UTF8

# 8) App.tsx — Expo Router entry (if missing)
$appts = "$root/App.tsx"
if (-not (Test-Path $appts)) {
    @'
import "expo-router/entry";
'@ | Set-Content $appts -Encoding UTF8
}

Write-Host "✅ Mobile scaffold restored under $root"
