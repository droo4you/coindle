import type { CachedPrices } from "./types";

/**
 * Simple cache layer.
 *
 * In production: swap this for Vercel KV / Upstash Redis.
 * For now: in-memory Map with JSON serialization works for
 * single-instance dev and even serverless (populated on cold start via cron).
 *
 * Keys:
 *   prices:YYYY-MM-DD       → CachedPrices (all coin tiers)
 *   daily:YYYY-MM-DD        → number (secret coin index)
 *   history:TICKER:YYYY-MM-DD → PricePoint[] (90-day history)
 */

// In-memory store (replaced by KV in production)
const store = new Map<string, string>();

export async function cacheGet<T>(key: string): Promise<T | null> {
  const val = store.get(key);
  if (!val) return null;
  return JSON.parse(val) as T;
}

export async function cacheSet<T>(
  key: string,
  value: T,
  ttlSeconds?: number
): Promise<void> {
  store.set(key, JSON.stringify(value));

  // Auto-expire after TTL (in-memory only)
  if (ttlSeconds) {
    setTimeout(() => store.delete(key), ttlSeconds * 1000);
  }
}

// ── Typed helpers ───────────────────────────────────────────────

export async function getCachedPrices(
  dateStr: string
): Promise<CachedPrices | null> {
  return cacheGet<CachedPrices>(`prices:${dateStr}`);
}

export async function setCachedPrices(
  dateStr: string,
  prices: CachedPrices
): Promise<void> {
  // TTL: 25 hours (survives until next cron run)
  await cacheSet(`prices:${dateStr}`, prices, 90000);
}

export async function getCachedHistory(
  ticker: string,
  dateStr: string
): Promise<{ timestamp: number; price: number }[] | null> {
  return cacheGet(`history:${ticker}:${dateStr}`);
}

export async function setCachedHistory(
  ticker: string,
  dateStr: string,
  history: { timestamp: number; price: number }[]
): Promise<void> {
  await cacheSet(`history:${ticker}:${dateStr}`, history, 90000);
}
