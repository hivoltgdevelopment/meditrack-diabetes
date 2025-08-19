import { supabase } from "../lib/supabase";

export type Insurance = {
  id: string;
  user_id: string;
  provider: string;
  policy_number: string;
  coverage_details?: string | null;
};

export async function listInsurance(): Promise<Insurance[]> {
  const { data, error } = await supabase
    .from("insurance")
    .select("id, user_id, provider, policy_number, coverage_details")
    .order("provider", { ascending: true });
  if (error) throw error;
  return (data as any) ?? [];
}

export async function insertInsurance(values: Partial<Insurance>) {
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) throw new Error("Not authed");
  const payload = { ...values, user_id: user.id };
  const { data, error } = await supabase
    .from("insurance")
    .insert(payload)
    .select("*")
    .single();
  if (error) throw error;
  return data as Insurance;
}

export async function updateInsurance(
  id: string,
  values: Partial<Insurance>
) {
  const { data, error } = await supabase
    .from("insurance")
    .update(values)
    .eq("id", id)
    .select("*")
    .single();
  if (error) throw error;
  return data as Insurance;
}

export async function deleteInsurance(id: string) {
  const { error } = await supabase.from("insurance").delete().eq("id", id);
  if (error) throw error;
}

