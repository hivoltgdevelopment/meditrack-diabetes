// Deno Deploy function (Supabase Edge)
// deno.json: { "imports": { "serve": "https://deno.land/std@0.224.0/http/server.ts" } }
import { serve } from "serve";
import { verify as verifyJwt } from "https://deno.land/x/djwt@v3.0.2/mod.ts";

serve(async (req: Request) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const token = req.headers.get("Authorization")?.replace("Bearer ", "");
  if (!token) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  const jwtSecret = Deno.env.get("SUPABASE_JWT_SECRET");
  if (!jwtSecret) {
    console.error("Missing SUPABASE_JWT_SECRET env");
    return new Response(JSON.stringify({ error: "Server error" }), {
      status: 500,
    });
  }

  try {
    await verifyJwt(token, new TextEncoder().encode(jwtSecret), "HS256");
  } catch (_) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  try {
    const {
      user_id,
      prescription_id,
      pharmacy_email,
      message,
    } = await req.json();
    if (!user_id || !prescription_id || !pharmacy_email) {
      return new Response(
        JSON.stringify({ error: "user_id, prescription_id, pharmacy_email required" }),
        { status: 400 },
      );
    }

    const apiKey = Deno.env.get("RESEND_API_KEY");
    const from = Deno.env.get("RESEND_FROM");
    if (!apiKey || !from) {
      console.error("Missing Resend configuration");
      return new Response(JSON.stringify({ error: "Server error" }), {
        status: 500,
      });
    }

    const emailRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [pharmacy_email],
        subject: "Prescription Refill Request",
        text: message || `Please refill prescription ${prescription_id}`,
      }),
    });

    const emailData = await emailRes.json();
    if (!emailRes.ok) {
      console.error("Resend error", emailData);
      return new Response(
        JSON.stringify({ error: "Failed to send email" }),
        { status: emailRes.status },
      );
    }

    return new Response(JSON.stringify({ ok: true, id: emailData.id }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("send-refill-email error", e);
    return new Response(JSON.stringify({ error: String(e) }), { status: 500 });
  }
});
