import { NextResponse } from "next/server";
import { fetchAllPrices } from "@/lib/pyth";
import { setCachedPrices } from "@/lib/cache";
import { getTodayDateString } from "@/lib/daily";

/**
 * Vercel Cron: runs at midnight UTC daily.
 * Fetches all prices from Pyth Hermes in one batch and caches them.
 */
export async function GET(request: Request) {
  // Verify cron secret in production
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const dateStr = getTodayDateString();
    const prices = await fetchAllPrices();

    const coinCount = Object.keys(prices).length;
    if (coinCount === 0) {
      return NextResponse.json(
        { error: "No prices fetched from Hermes" },
        { status: 502 }
      );
    }

    await setCachedPrices(dateStr, prices);

    return NextResponse.json({
      ok: true,
      date: dateStr,
      coinsUpdated: coinCount,
    });
  } catch (error) {
    console.error("Cron daily error:", error);
    return NextResponse.json(
      { error: "Failed to update prices" },
      { status: 500 }
    );
  }
}
