
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
export async function initHealth() {
  // TODO: request permissions and set up subscriptions with native modules.
  return true;
}

/** Fetch CGM readings from platform APIs (stub). */
export async function fetchCgmReadings(): Promise<CgmReading[]> {
  // TODO: replace with HealthKit/Google Fit queries for glucose samples.
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
