import crypto from "crypto";

/**
 * Verify Shopify App Proxy HMAC
 */
function verifyShopifyProxy(request) {
  const url = new URL(request.url);
  const params = Object.fromEntries(url.searchParams.entries());

  const hmac = params.hmac;
  delete params.hmac;
  delete params.signature;

  const message = new URLSearchParams(params).toString();

  const digest = crypto
    .createHmac("sha256", process.env.SHOPIFY_API_SECRET)
    .update(message)
    .digest("hex");

  if (!hmac) return false;

  return crypto.timingSafeEqual(
    Buffer.from(digest, "utf8"),
    Buffer.from(hmac, "utf8")
  );
}

export async function handleAppProxy(request) {
  if (!verifyShopifyProxy(request)) {
    return new Response(
      JSON.stringify({ error: "Unauthorized" }),
      { status: 401, headers: { "Content-Type": "application/json" } }
    );
  }

  return new Response(
    JSON.stringify({
      success: true,
      app: "epay",
      message: "Shopify App Proxy working 🚀",
    }),
    { status: 200, headers: { "Content-Type": "application/json" } }
  );
}
