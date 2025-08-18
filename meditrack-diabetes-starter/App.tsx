
import React, { useEffect, useState } from "react";
import { supabase } from "./src/lib/supabase";
import AuthScreen from "./src/screens/Auth";
import Dashboard from "./src/screens/Dashboard";
import RxForm from "./src/screens/RxForm";
import { ensureNotificationPermission } from "./src/lib/notify";
import { Rx } from "./src/services/rx";
import { View } from "react-native";

type Screen = { name: "auth" } | { name: "home" } | { name: "form"; rx?: Rx };

export default function App() {
  const [screen, setScreen] = useState<Screen>({ name: "auth" });

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setScreen(data.session ? { name: "home" } : { name: "auth" }));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setScreen(s ? { name: "home" } : { name: "auth" }));
    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => { ensureNotificationPermission(); }, []);

  if (screen.name === "auth") return <AuthScreen onAuthed={() => setScreen({ name: "home" })} />;

  if (screen.name === "form") {
    return <RxForm initial={screen.rx} onSaved={() => setScreen({ name: "home" })} />;
  }

  return (
    <View style={{ flex: 1 }}>
      <Dashboard
        onAdd={() => setScreen({ name: "form" })}
        onEdit={(rx) => setScreen({ name: "form", rx })}
      />
    </View>
  );
}
