// Deno Deploy function (Supabase Edge)
// deno.json: { "imports": { "serve": "https://deno.land/std@0.224.0/http/server.ts" } }
import { serve } from "serve";

serve(async (req: Request) => {
  // Basic auth guard
  const jwt = req.headers.get("Authorization")?.replace("Bearer ", "");
  if (!jwt) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    const { prescription_id } = await req.json();
    if (!prescription_id) throw new Error("prescription_id required");

    // Stub—no email yet. This is where Resend would be called.
    console.log("send-refill-email called", {
      prescription_id,
      at: new Date().toISOString(),
    });

    return new Response(JSON.stringify({ ok: true }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), { status: 400 });
  }
});
