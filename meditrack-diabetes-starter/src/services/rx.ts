
import { supabase } from "../lib/supabase";

export type Rx = {
  id: string;
  user_id: string;
  name: string;
  dosage?: string | null;
  frequency?: string | null;
  next_refill_date?: string | null;
  notes?: string | null;
  created_at: string;
  updated_at: string;
};

export async function listPrescriptions(): Promise<Rx[]> {
  const { data, error } = await supabase
    .from("prescriptions")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function insertPrescription(values: Partial<Rx>) {
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) throw new Error("Not authed");
  const payload = { ...values, user_id: user.id };
  const { data, error } = await supabase.from("prescriptions").insert(payload).select("*").single();
  if (error) throw error;
  return data;
}

export async function updatePrescription(id: string, values: Partial<Rx>) {
  const { data, error } = await supabase.from("prescriptions").update(values).eq("id", id).select("*").single();
  if (error) throw error;
  return data;
}

export async function deletePrescription(id: string) {
  const { error } = await supabase.from("prescriptions").delete().eq("id", id);
  if (error) throw error;
}
