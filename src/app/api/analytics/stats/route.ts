import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

export async function GET() {
  const { data, error } = await supabase
    .from("game_events")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const total = data.length;
  const wins = data.filter((e) => e.result === "win").length;
  const daily = data.filter((e) => e.mode === "daily").length;
  const freeplay = data.filter((e) => e.mode === "freeplay").length;

  // Unique days played
  const uniqueDays = new Set(
    data.map((e) => new Date(e.created_at).toISOString().split("T")[0])
  ).size;

  // Today's games
  const today = new Date().toISOString().split("T")[0];
  const todayGames = data.filter(
    (e) => new Date(e.created_at).toISOString().split("T")[0] === today
  );

  return NextResponse.json({
    total_games: total,
    wins,
    losses: total - wins,
    win_rate: total > 0 ? `${((wins / total) * 100).toFixed(1)}%` : "0%",
    daily_games: daily,
    freeplay_games: freeplay,
    unique_days: uniqueDays,
    today: {
      games: todayGames.length,
      wins: todayGames.filter((e) => e.result === "win").length,
    },
    recent: data.slice(0, 20),
  });
}
