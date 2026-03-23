import { NextRequest, NextResponse } from "next/server";
import QRCode from "qrcode";
import { ACTIONS_CORS_HEADERS } from "@/lib/actions";

/**
 * GET /api/qr?url=<encoded-url>
 *
 * Generates a QR code PNG image for the given URL. This is useful for
 * rendering Blink action URLs as scannable QR codes in the merchant
 * point-of-sale UI.
 *
 * Example:
 *   /api/qr?url=solana-action:https://example.com/api/actions/pay?amount=1&merchant=ABC
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get("url");

  if (!url) {
    return NextResponse.json(
      { error: "Missing required query param: url" },
      { status: 400, headers: ACTIONS_CORS_HEADERS }
    );
  }

  try {
    const pngBuffer = await QRCode.toBuffer(url, {
      type: "png",
      width: 512,
      margin: 2,
      color: {
        dark: "#000000",
        light: "#FFFFFF",
      },
      errorCorrectionLevel: "M",
    });

    return new NextResponse(new Uint8Array(pngBuffer), {
      status: 200,
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=3600",
        ...ACTIONS_CORS_HEADERS,
      },
    });
  } catch (error) {
    console.error("QR generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate QR code" },
      { status: 500, headers: ACTIONS_CORS_HEADERS }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: ACTIONS_CORS_HEADERS,
  });
}
