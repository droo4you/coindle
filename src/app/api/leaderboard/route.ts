import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

export async function POST(req: Request) {
  try {
    const { userId, username, puzzleNumber, guesses, won } = await req.json();

    if (!userId || !username || !puzzleNumber || !guesses) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const { error } = await supabase.from("leaderboard").upsert(
      {
        user_id: userId,
        username,
        puzzle_number: puzzleNumber,
        guesses,
        won: won ?? false,
      },
      { onConflict: "user_id,puzzle_number" }
    );

    if (error) {
      console.error("Leaderboard insert error:", error);
      return NextResponse.json({ error: "DB error" }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const puzzle = searchParams.get("puzzle");

  if (puzzle) {
    // Daily leaderboard for a specific puzzle
    const { data, error } = await supabase
      .from("leaderboard")
      .select("*")
      .eq("puzzle_number", Number(puzzle))
      .eq("won", true)
      .order("guesses", { ascending: true })
      .order("created_at", { ascending: true })
      .limit(20);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ entries: data });
  }

  // All-time leaderboard: most wins
  const { data, error } = await supabase
    .from("leaderboard")
    .select("username, user_id");

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Aggregate wins and avg guesses per user
  const userMap = new Map<string, { username: string; wins: number; totalGuesses: number; games: number }>();
  for (const row of data ?? []) {
    const key = row.user_id;
    if (!userMap.has(key)) {
      userMap.set(key, { username: row.username, wins: 0, totalGuesses: 0, games: 0 });
    }
    const u = userMap.get(key)!;
    u.games++;
  }

  // Need full data for wins calculation
  const { data: fullData } = await supabase
    .from("leaderboard")
    .select("user_id, username, guesses, won");

  const allTimeMap = new Map<string, { username: string; wins: number; totalGuesses: number; games: number }>();
  for (const row of fullData ?? []) {
    if (!allTimeMap.has(row.user_id)) {
      allTimeMap.set(row.user_id, { username: row.username, wins: 0, totalGuesses: 0, games: 0 });
    }
    const u = allTimeMap.get(row.user_id)!;
    u.games++;
    if (row.won) {
      u.wins++;
      u.totalGuesses += row.guesses;
    }
  }

  const allTime = Array.from(allTimeMap.values())
    .filter((u) => u.wins > 0)
    .sort((a, b) => {
      if (b.wins !== a.wins) return b.wins - a.wins;
      return (a.totalGuesses / a.wins) - (b.totalGuesses / b.wins);
    })
    .slice(0, 20)
    .map((u) => ({
      username: u.username,
      wins: u.wins,
      games: u.games,
      avgGuesses: (u.totalGuesses / u.wins).toFixed(1),
    }));

  return NextResponse.json({ entries: allTime });
}
