import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/receipt/pdf?tx={signature}&amount={amount}&merchant={name}&loyalty={tokens}&currency={SOL|USDC}
 *
 * Returns the same HTML receipt but with headers that trigger a browser
 * download. The HTML page includes a print-friendly stylesheet so the user
 * can "Save as PDF" via the browser's print dialog, or simply download and
 * open the file.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const tx = searchParams.get("tx") ?? "";
  const amount = searchParams.get("amount") ?? "0";
  const merchant = searchParams.get("merchant") ?? "Comercio";
  const loyalty = searchParams.get("loyalty") ?? "0";
  const currency = searchParams.get("currency") ?? "SOL";

  if (!tx) {
    return NextResponse.json(
      { error: "Missing required query param: tx" },
      { status: 400 }
    );
  }

  // Fetch the HTML receipt from the sibling route
  const baseUrl = request.nextUrl.origin;
  const receiptParams = new URLSearchParams({
    tx,
    amount,
    merchant,
    loyalty,
    currency,
  });
  const receiptUrl = `${baseUrl}/api/receipt?${receiptParams.toString()}`;

  try {
    const res = await fetch(receiptUrl);
    let html = await res.text();

    // Inject auto-print script so the browser print dialog opens automatically,
    // allowing the user to save as PDF.
    const printScript = `
    <script>
      window.addEventListener('load', function() {
        // Small delay to allow styles to render
        setTimeout(function() { window.print(); }, 400);
      });
    </script>`;

    html = html.replace("</body>", `${printScript}\n</body>`);

    const shortTx = tx.slice(0, 12);
    const filename = `iPay_Comprobante_${shortTx}.html`;

    return new NextResponse(html, {
      status: 200,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error("Receipt PDF generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate receipt" },
      { status: 500 }
    );
  }
}
