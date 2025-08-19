
import React from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as Print from 'expo-print';
import { supabase } from '../lib/supabase';

export default function Reports() {
  const exportPrescriptionsCsv = async () => {
    const { data, error } = await supabase
      .from('prescriptions')
      .select('name,category,remaining_quantity,frequency');
    if (error) return Alert.alert('Error', error.message);
    const header = 'name,category,remaining,frequency\n';
    const rows = (data || []).map((d) =>
      [d.name, d.category, d.remaining_quantity, d.frequency || ''].join(',')
    );
    const csv = header + rows.join('\n');
    const path = FileSystem.cacheDirectory + 'meditrack-prescriptions.csv';
    await FileSystem.writeAsStringAsync(path, csv, {
      encoding: FileSystem.EncodingType.UTF8,
    });
    await Sharing.shareAsync(path, { mimeType: 'text/csv' });
  };

  const exportGlucoseCsv = async () => {
    const { data, error } = await supabase
      .from('blood_glucose_logs')
      .select('value,recorded_at');
    if (error) return Alert.alert('Error', error.message);
    const header = 'value,recorded_at\n';
    const rows = (data || []).map((d) =>
      [d.value, d.recorded_at].join(',')
    );
    const csv = header + rows.join('\n');
    const path = FileSystem.cacheDirectory + 'meditrack-glucose.csv';
    await FileSystem.writeAsStringAsync(path, csv, {
      encoding: FileSystem.EncodingType.UTF8,
    });
    await Sharing.shareAsync(path, { mimeType: 'text/csv' });
  };

  const exportPdf = async () => {
    const { data: rx } = await supabase
      .from('prescriptions')
      .select('name,category,remaining_quantity,frequency');
    const { data: logs } = await supabase
      .from('blood_glucose_logs')
      .select('value,recorded_at');
    const rxRows = (rx || [])
      .map(
        (r) =>
          `<tr><td>${r.name}</td><td>${r.category}</td><td>${r.remaining_quantity}</td><td>${
            r.frequency || ''
          }</td></tr>`
      )
      .join('');
    const logRows = (logs || [])
      .map((l) => `<tr><td>${l.value}</td><td>${l.recorded_at}</td></tr>`) // simple
      .join('');
    const html = `
      <h1>MediTrack Report</h1>
      <h2>Prescriptions</h2>
      <table border="1" style="border-collapse:collapse"><tr><th>Name</th><th>Category</th><th>Remaining</th><th>Frequency</th></tr>${rxRows}</table>
      <h2>Blood Glucose Logs</h2>
      <table border="1" style="border-collapse:collapse"><tr><th>Value</th><th>Recorded At</th></tr>${logRows}</table>
    `;
    const file = await Print.printToFileAsync({ html });
    await Sharing.shareAsync(file.uri, { mimeType: 'application/pdf' });
  };

  return (
    <View style={{ padding: 16, gap: 12 }}>
      <Text style={{ fontSize: 24, fontWeight: '600' }}>Reports</Text>
      <TouchableOpacity
        style={{ padding: 16, backgroundColor: '#2563eb', borderRadius: 12 }}
        onPress={exportPrescriptionsCsv}
      >
        <Text style={{ textAlign: 'center', color: 'white', fontWeight: '600' }}>
          Export Prescriptions CSV
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={{ padding: 16, backgroundColor: '#0f766e', borderRadius: 12 }}
        onPress={exportGlucoseCsv}
      >
        <Text style={{ textAlign: 'center', color: 'white', fontWeight: '600' }}>
          Export Glucose CSV
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={{ padding: 16, backgroundColor: '#6b21a8', borderRadius: 12 }}
        onPress={exportPdf}
      >
        <Text style={{ textAlign: 'center', color: 'white', fontWeight: '600' }}>
          Export PDF
        </Text>
      </TouchableOpacity>
    </View>
  );
}
