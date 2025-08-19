import { supabase } from "../lib/supabase";

export type Pharmacy = {
  id: string;
  name: string;
  address?: string | null;
};

export async function listPharmacies(): Promise<Pharmacy[]> {
  const { data, error } = await supabase
    .from("pharmacies")
    .select("id,name,address")
    .order("name", { ascending: true });
  if (error) throw error;
  return data ?? [];
}
