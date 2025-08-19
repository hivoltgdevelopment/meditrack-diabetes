import { supabase } from "../lib/supabase";

export type InventoryItem = {
  id: string;
  user_id: string;
  prescription_id: string;
  lot_number?: string | null;
  expiration_date?: string | null;
  quantity: number;
  prescriptions?: { name: string | null } | null;
};

export async function listInventory(): Promise<InventoryItem[]> {
  const { data, error } = await supabase
    .from("inventory")
    .select("id, user_id, prescription_id, lot_number, expiration_date, quantity, prescriptions(name)")
    .order("expiration_date", { ascending: true });
  if (error) throw error;
  return (data as any) ?? [];
}

export async function insertInventory(values: Partial<InventoryItem>) {
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) throw new Error("Not authed");
  const payload = { ...values, user_id: user.id };
  const { data, error } = await supabase
    .from("inventory")
    .insert(payload)
    .select("*")
    .single();
  if (error) throw error;
  return data as InventoryItem;
}

export async function updateInventory(id: string, values: Partial<InventoryItem>) {
  const { data, error } = await supabase
    .from("inventory")
    .update(values)
    .eq("id", id)
    .select("*")
    .single();
  if (error) throw error;
  return data as InventoryItem;
}

export async function deleteInventory(id: string) {
  const { error } = await supabase.from("inventory").delete().eq("id", id);
  if (error) throw error;
}
