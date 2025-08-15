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
