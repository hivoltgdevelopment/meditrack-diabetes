import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import { supabase } from './supabase';

/**
 * Register the device for push notifications and persist the resulting token
 * so that we can send targeted notifications to the user later on.
 */
export async function registerPushToken(userId: string) {
  // Ask for the notification permissions first
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') return;

  // Retrieve Expo push token. This can later be used to send notifications via Expo
  const expoPushToken = await Notifications.getExpoPushTokenAsync();

  // FCM/APNS token for direct messaging, if available
  let deviceToken: string | undefined;
  if (Platform.OS === 'android') {
    const { data } = await Notifications.getDevicePushTokenAsync();
    deviceToken = data;
  }

  const { error } = await supabase.from('push_tokens').upsert({
    user_id: userId,
    expo_token: expoPushToken.data,
    device_token: deviceToken,
  });

  if (error) {
    console.error('Failed to register push token', error);
  }
}
