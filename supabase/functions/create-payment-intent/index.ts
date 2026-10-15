import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) {
      throw new Error("STRIPE_SECRET_KEY no configurada en los secrets de Supabase");
    }

    const { amount, currency = "usd", customerEmail, metadata } = await req.json();
    const amountInCents = Math.round((Number(amount) || 1) * 100);

    const body = new URLSearchParams();
    body.append("amount", amountInCents.toString());
    body.append("currency", currency.toLowerCase());
    body.append("payment_method_types[]", "card");
    if (customerEmail) {
      body.append("receipt_email", customerEmail);
    }
    if (metadata) {
      for (const [key, val] of Object.entries(metadata)) {
        body.append(`metadata[${key}]`, String(val));
      }
    }

    const stripeRes = await fetch("https://api.stripe.com/v1/payment_intents", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${stripeKey}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: body.toString(),
    });

    const paymentIntent = await stripeRes.json();
    if (!stripeRes.ok) {
      return new Response(JSON.stringify({ error: paymentIntent.error?.message || "Error en Stripe" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(
      JSON.stringify({
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
