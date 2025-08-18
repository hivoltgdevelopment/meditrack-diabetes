import React, { useEffect } from "react";
import { NavigationContainer, useNavigationContainerRef } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { supabase } from "./src/lib/supabase";
import AuthScreen from "./src/screens/Auth";
import Dashboard from "./src/screens/Dashboard";
import RxForm from "./src/screens/RxForm";
import { ensureNotificationPermission } from "./src/lib/notify";
import { Rx } from "./src/services/rx";

type RootStackParamList = {
  Auth: undefined;
  Dashboard: undefined;
  RxForm: { rx?: Rx } | undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

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

  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator initialRouteName="Auth">
        <Stack.Screen name="Auth" options={{ headerShown: false }}>
          {({ navigation }) => (
            <AuthScreen onAuthed={() => navigation.reset({ index: 0, routes: [{ name: "Dashboard" }] })} />
          )}
        </Stack.Screen>
        <Stack.Screen name="Dashboard" options={{ headerShown: false }}>
          {({ navigation }) => (
            <Dashboard
              onAdd={() => navigation.navigate("RxForm")}
              onEdit={(rx) => navigation.navigate("RxForm", { rx })}
            />
          )}
        </Stack.Screen>
        <Stack.Screen name="RxForm" options={{ title: "Prescription" }}>
          {({ navigation, route }) => (
            <RxForm
              initial={route.params?.rx}
              onSaved={() => navigation.goBack()}
            />
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
