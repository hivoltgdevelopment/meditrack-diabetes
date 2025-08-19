import { supabase } from "../lib/supabase";

export type Doctor = {
  id: string;
  first_name?: string | null;
  last_name?: string | null;
  email: string;
};

export async function listDoctors(): Promise<Doctor[]> {
  const { data, error } = await supabase
    .from("users")
    .select("id,first_name,last_name,email")
    .eq("role", "doctor")
    .order("last_name", { ascending: true });
  if (error) throw error;
  return data ?? [];
}
