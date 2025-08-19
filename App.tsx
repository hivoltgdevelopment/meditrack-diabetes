import React, { useEffect, useState } from "react";
import { supabase } from "./src/lib/supabase";
import AuthScreen from "./src/screens/Auth";
import Dashboard from "./src/screens/Dashboard";
import RxForm from "./src/screens/RxForm";
import Inventory from "./src/screens/Inventory";
import Pharmacies from "./src/screens/Pharmacies";
import Doctors from "./src/screens/Doctors";
import Profile from "./src/screens/Profile";
import Insurance from "./src/screens/Insurance";
import { ensureNotificationPermission } from "./src/lib/notify";
import { Rx } from "./src/services/rx";
import { View } from "react-native";

type Screen =
  | { name: "auth" }
  | { name: "home" }
  | { name: "form"; rx?: Rx }
  | { name: "inventory" }
  | { name: "pharmacies" }
  | { name: "doctors" }
  | { name: "profile" }
  | { name: "insurance" };

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

  if (screen.name === "inventory") {
    return <Inventory onBack={() => setScreen({ name: "home" })} />;
  }

  if (screen.name === "pharmacies") {
    return <Pharmacies onBack={() => setScreen({ name: "home" })} />;
  }

  if (screen.name === "doctors") {
    return <Doctors onBack={() => setScreen({ name: "home" })} />;
  }

  if (screen.name === "profile") {
    return (
      <Profile
        onInsurance={() => setScreen({ name: "insurance" })}
        onBack={() => setScreen({ name: "home" })}
      />
    );
  }

  if (screen.name === "insurance") {
    return <Insurance onBack={() => setScreen({ name: "profile" })} />;
  }

  return (
    <View style={{ flex: 1 }}>
      <Dashboard
        onAdd={() => setScreen({ name: "form" })}
        onEdit={(rx) => setScreen({ name: "form", rx })}
        onInventory={() => setScreen({ name: "inventory" })}
        onPharmacies={() => setScreen({ name: "pharmacies" })}
        onDoctors={() => setScreen({ name: "doctors" })}
        onProfile={() => setScreen({ name: "profile" })}
      />
    </View>
  );
}
