import { supabase } from "../lib/supabase";
import type { Insurance } from "../lib/database.types";

function assertInsurance(record: unknown): asserts record is Insurance {
  const r = record as Record<string, unknown> | null;
  if (
    !r ||
    typeof r.id !== "string" ||
    typeof r.user_id !== "string" ||
    typeof r.provider !== "string" ||
    typeof r.policy_number !== "string" ||
    !(typeof r.coverage_details === "string" || r.coverage_details === null)
  ) {
    throw new Error("Invalid insurance record");
  }
}

export async function listInsurance(): Promise<Insurance[]> {
  const { data, error } = await supabase
    .from("insurance")
    .select("id, user_id, provider, policy_number, coverage_details")
    .order("provider", { ascending: true });
  if (error) throw error;
  const rows = data ?? [];
  rows.forEach(assertInsurance);
  return rows;
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
  assertInsurance(data);
  return data;
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
  assertInsurance(data);
  return data;
}

export async function deleteInsurance(id: string) {
  const { error } = await supabase.from("insurance").delete().eq("id", id);
  if (error) throw error;
}

