
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

export async function ensureNotificationPermission(): Promise<boolean> {
  const settings = await Notifications.getPermissionsAsync();
  if (settings.granted) return true;
  const req = await Notifications.requestPermissionsAsync();
  return req.granted || (Platform.OS === "ios" ? req.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL : false);
}

export async function scheduleRefillReminder(date: Date, title: string) {
  const d = new Date(date);
  d.setHours(9, 0, 0, 0);
  return Notifications.scheduleNotificationAsync({
    content: { title: "Refill reminder", body: title },
    trigger: d,
  });
}
