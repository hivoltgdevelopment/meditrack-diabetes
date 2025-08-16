import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { supabase } from '../lib/supabase';

export default function Add() {
  const [name, setName] = useState('');
  const [dosage, setDosage] = useState('');
  const [frequency, setFrequency] = useState('');
  const [category, setCategory] = useState<'medication' | 'supply'>('medication');

  const save = async () => {
    const { data: userResp, error: userErr } = await supabase.auth.getUser();
    if (userErr || !userResp.user) {
      Alert.alert('Error', 'Not signed in');
      return;
    }

    const { error } = await supabase.from('prescriptions').insert({
      user_id: userResp.user.id, // 👈 attach the authenticated user
      name,
      dosage,
      frequency,
      category,
    });

    if (error) {
      Alert.alert('Error', error.message);
    } else {
      Alert.alert('Saved', 'Prescription added');
      setName('');
      setDosage('');
      setFrequency('');
    }
  };

  return (
    <View style={{ padding: 16, gap: 12 }}>
      <Text>Name</Text>
      <TextInput style={{ borderWidth: 1, borderRadius: 8, padding: 8 }} value={name} onChangeText={setName} />

      <Text>Dosage</Text>
      <TextInput style={{ borderWidth: 1, borderRadius: 8, padding: 8 }} value={dosage} onChangeText={setDosage} />

      <Text>Frequency</Text>
      <TextInput style={{ borderWidth: 1, borderRadius: 8, padding: 8 }} value={frequency} onChangeText={setFrequency} />

      <TouchableOpacity
        style={{ padding: 16, backgroundColor: '#2563eb', borderRadius: 12 }}
        onPress={save}
      >
        <Text style={{ textAlign: 'center', color: 'white', fontWeight: '600' }}>Save</Text>
      </TouchableOpacity>
    </View>
  );
}


  return (
    <View style={{ padding: 16, gap: 12 }}>
      <Text>Name</Text>
      <TextInput style={{ borderWidth: 1, borderRadius: 8, padding: 8 }} value={name} onChangeText={setName} />
      <Text>Dosage</Text>
      <TextInput style={{ borderWidth: 1, borderRadius: 8, padding: 8 }} value={dosage} onChangeText={setDosage} />
      <Text>Frequency</Text>
      <TextInput style={{ borderWidth: 1, borderRadius: 8, padding: 8 }} value={frequency} onChangeText={setFrequency} />
      <TouchableOpacity style={{ padding: 16, backgroundColor: '#2563eb', borderRadius: 12 }} onPress={save}>
        <Text style={{ textAlign: 'center', color: 'white', fontWeight: '600' }}>Save</Text>
      </TouchableOpacity>
    </View>
  );
}
