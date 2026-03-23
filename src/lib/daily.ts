import { COINS } from "./coins";

/**
 * Deterministic daily coin selection.
 * Uses a simple string hash of the UTC date to pick a coin index.
 */
function hashDateString(dateStr: string): number {
  let hash = 0;
  for (let i = 0; i < dateStr.length; i++) {
    const char = dateStr.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}

export function getTodayDateString(): string {
  const now = new Date();
  return now.toISOString().split("T")[0]; // YYYY-MM-DD in UTC
}

export function getDailyCoinIndex(dateStr?: string): number {
  const date = dateStr ?? getTodayDateString();
  const hash = hashDateString(date);
  return hash % COINS.length;
}

/** Launch date — Coindle #1 starts here */
const LAUNCH_DATE = new Date("2026-03-22T00:00:00Z");

/** Returns the daily puzzle number (1-indexed) */
export function getDailyPuzzleNumber(dateStr?: string): number {
  const date = dateStr ?? getTodayDateString();
  const target = new Date(date + "T00:00:00Z");
  const diffMs = target.getTime() - LAUNCH_DATE.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  return Math.max(1, diffDays + 1);
}

export function getRandomCoinIndex(excludeIndex?: number): number {
  let index: number;
  do {
    index = Math.floor(Math.random() * COINS.length);
  } while (index === excludeIndex);
  return index;
}

/**
 * Milliseconds until next UTC midnight.
 */
export function msUntilMidnightUTC(): number {
  const now = new Date();
  const tomorrow = new Date(
    Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate() + 1,
      0,
      0,
      0
    )
  );
  return tomorrow.getTime() - now.getTime();
}
