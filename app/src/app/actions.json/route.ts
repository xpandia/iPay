import { NextResponse } from "next/server";
import { ACTIONS_CORS_HEADERS } from "@/lib/actions";

/**
 * GET /actions.json
 *
 * Returns the Actions routing configuration as required by the Solana Actions
 * specification. Wallets and Blink clients fetch this file from the domain
 * root to discover which URL paths are Solana Action endpoints.
 */
export async function GET() {
  const payload = {
    rules: [
      {
        pathPattern: "/api/actions/**",
        apiPath: "/api/actions/**",
      },
    ],
  };

  return NextResponse.json(payload, { headers: ACTIONS_CORS_HEADERS });
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: ACTIONS_CORS_HEADERS,
  });
}
