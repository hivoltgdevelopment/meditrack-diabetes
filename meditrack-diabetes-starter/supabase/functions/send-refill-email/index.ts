
// Deno Deploy function (Supabase Edge)
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

serve(async (req: Request) => {
  const jwt = req.headers.get("Authorization")?.replace("Bearer ", "");
  if (!jwt) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });

  if (req.method !== "POST") return new Response("Method not allowed", { status: 405 });

  try {
    const { prescription_id } = await req.json();
    if (!prescription_id) throw new Error("prescription_id required");
    console.log("send-refill-email called", { prescription_id, at: new Date().toISOString() });
    return new Response(JSON.stringify({ ok: true }), { headers: { "Content-Type": "application/json" } });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), { status: 400 });
  }
});
