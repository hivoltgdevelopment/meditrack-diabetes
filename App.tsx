import React, { useEffect } from "react";
import { NavigationContainer, useNavigationContainerRef } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
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
  const navigationRef = useNavigationContainerRef<RootStackParamList>();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        navigationRef.reset({ index: 0, routes: [{ name: "Dashboard" }] });
      }
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      navigationRef.reset({ index: 0, routes: [{ name: session ? "Dashboard" : "Auth" }] });
    });
    return () => sub.subscription.unsubscribe();
  }, [navigationRef]);

  useEffect(() => { ensureNotificationPermission(); }, []);
