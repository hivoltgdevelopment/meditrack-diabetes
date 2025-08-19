import { supabase } from "../lib/supabase";

export async function requestRefill(prescription_id: string) {
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) throw new Error("Not authed");
  const payload = { prescription_id, user_id: user.id };
  const { error } = await supabase
    .from("refill_requests")
    .insert(payload);
  if (error) throw error;
  await supabase.functions.invoke("send-refill-email", {
    body: { prescription_id },
  });
}
