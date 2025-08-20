
import { Platform } from 'react-native';
import AppleHealthKit, {
  HealthKitPermissions,
} from 'react-native-health';
import GoogleFit, { Scopes } from 'react-native-google-fit';
import { supabase } from './supabase';

/** Types representing a CGM reading. */
export interface CgmReading {
  value: number;
  timestamp: Date;
}

/**
 * Health integrations stubs. Implement platform-specific permissions
 * (Apple HealthKit & Google Fit) in native modules or Expo plugins.
 */
let subscribed = false;

export async function initHealth() {
  if (Platform.OS === 'ios') {
    const permissions: HealthKitPermissions = {
      permissions: {
        read: [AppleHealthKit.Constants.Permissions.BloodGlucose],
      },
    };
    const ok = await new Promise<boolean>((resolve) => {
      AppleHealthKit.initHealthKit(permissions, (error) => {
        resolve(!error);
      });
    });
    if (!ok) return false;
    if (!subscribed) {
      AppleHealthKit.setObserver(
        { type: AppleHealthKit.Constants.Permissions.BloodGlucose },
        () => syncCgmData()
      );
      subscribed = true;
    }
    return true;
  }

  if (Platform.OS === 'android') {
    const res = await GoogleFit.authorize({
      scopes: [Scopes.FITNESS_BLOOD_GLUCOSE_READ],
    });
    if (!res.success) return false;
    if (!subscribed) {
      GoogleFit.startRecording(() => syncCgmData());
      subscribed = true;
    }
    return true;
  }

  return false;
}

/** Fetch CGM readings from platform APIs (stub). */
export async function fetchCgmReadings(): Promise<CgmReading[]> {
  const now = new Date();
  const startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000); // last 24h

  if (Platform.OS === 'ios') {
    return new Promise((resolve) => {
      AppleHealthKit.getBloodGlucoseSamples(
        {
          startDate: startDate.toISOString(),
          endDate: now.toISOString(),
          unit: 'mg/dL',
        },
        (err: any, results: any[]) => {
          if (err || !results) return resolve([]);
          resolve(
            results.map((r) => ({
              value: r.value,
              timestamp: new Date(r.startDate),
            }))
          );
        }
      );
    });
  }

  if (Platform.OS === 'android') {
    try {
      const samples = await GoogleFit.getSamples({
        startDate: startDate.toISOString(),
        endDate: now.toISOString(),
        dataType: 'com.google.blood_glucose',
      });
      return samples.map((s: any) => ({
        value: s.value,
        timestamp: new Date(s.startDate),
      }));
    } catch (_e) {
      return [];
    }
  }

  return [];
}

/** Store CGM readings into the `blood_glucose_logs` table. */
export async function syncCgmData() {
  const readings = await fetchCgmReadings();
  if (!readings.length) return;

  await supabase.from('blood_glucose_logs').insert(
    readings.map((r) => ({
      value: r.value,
      recorded_at: r.timestamp.toISOString(),
      source: 'CGM',
    }))
  );
}
