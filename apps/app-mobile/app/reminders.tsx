import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import * as Notifications from 'expo-notifications';

async function scheduleLocalReminder(title: string, body: string, seconds: number) {
  await Notifications.scheduleNotificationAsync({
    content: { title, body },
    trigger: { seconds },
  });
}

export default function Reminders() {
  const [inSeconds, setInSeconds] = useState('');

  const handleSchedule = async () => {
    try {
      await scheduleLocalReminder(
        "MediTrack",
        "Time to take your medication",
        Number(inSeconds) || 10 // 👈 this line goes *inside* your handler
      );
      Alert.alert('Reminder set', `Notification in ${inSeconds || 10} seconds`);
    } catch (err: any) {
      Alert.alert('Error', err.message);
    }
  };

  return (
    <View style={{ padding: 16, gap: 12 }}>
      <Text>Schedule test reminder (seconds from now)</Text>
      <TextInput
        style={{ borderWidth: 1, borderRadius: 8, padding: 8 }}
        value={inSeconds}
        onChangeText={setInSeconds}
        keyboardType="numeric"
      />
      <TouchableOpacity
        style={{ padding: 16, backgroundColor: '#16a34a', borderRadius: 12 }}
        onPress={handleSchedule}
      >
        <Text style={{ color: 'white', textAlign: 'center' }}>Schedule</Text>
      </TouchableOpacity>
    </View>
  );
}
