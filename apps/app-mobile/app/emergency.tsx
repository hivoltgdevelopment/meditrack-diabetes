
import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import QRCode from 'qrcode';
import { addToWallet } from '../lib/wallet';

export default function Emergency() {
  const [uri, setUri] = useState<string>('');
  const payload = JSON.stringify({ a: 'medications', v: 1 });

  useEffect(() => {
    (async () => {
      const dataUrl = await QRCode.toDataURL(payload);
      setUri(dataUrl);
    })();
  }, []);

  const handleWallet = async () => {
    await addToWallet(payload);
  };

  return (
    <View style={{ padding: 16, alignItems: 'center', gap: 12 }}>
      <Text style={{ fontSize: 24, fontWeight: '700' }}>Emergency Card</Text>
      {uri ? <Image source={{ uri }} style={{ width: 200, height: 200 }} /> : null}
      <Text style={{ textAlign: 'center' }}>
        Scan to access your emergency regimen (stored in app).
      </Text>
      <TouchableOpacity
        style={{ padding: 12, backgroundColor: '#2563eb', borderRadius: 8 }}
        onPress={handleWallet}
      >
        <Text style={{ color: 'white', fontWeight: '600' }}>Add to Wallet</Text>
      </TouchableOpacity>
    </View>
  );
}
