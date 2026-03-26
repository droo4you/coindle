"use client";

import { useEffect, useState } from "react";

interface Stats {
  total_games: number;
  wins: number;
  losses: number;
  win_rate: string;
  daily_games: number;
  freeplay_games: number;
  unique_days: number;
  today: { games: number; wins: number };
  recent: {
    id: number;
    created_at: string;
    mode: string;
    difficulty: string;
    result: string;
    guesses: number;
    answer: string;
    platform: string;
  }[];
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/analytics/stats")
      .then((r) => r.json())
      .then((d) => { setStats(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return (
    <div style={{ background: "#1A1F2B", color: "#E8E6E1", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "system-ui" }}>
      Loading...
    </div>
  );

  if (!stats) return (
    <div style={{ background: "#1A1F2B", color: "#F87171", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "system-ui" }}>
      Failed to load stats
    </div>
  );

  const cards = [
    { label: "Total Games", value: stats.total_games, color: "#5B8DEF" },
    { label: "Wins", value: stats.wins, color: "#4ADE80" },
    { label: "Losses", value: stats.losses, color: "#F87171" },
    { label: "Win Rate", value: stats.win_rate, color: "#FBBF24" },
    { label: "Daily Games", value: stats.daily_games, color: "#5B8DEF" },
    { label: "Free Play", value: stats.freeplay_games, color: "#A78BFA" },
    { label: "Today's Games", value: stats.today.games, color: "#5B8DEF" },
    { label: "Today's Wins", value: stats.today.wins, color: "#4ADE80" },
  ];

  return (
    <div style={{ background: "#1A1F2B", color: "#E8E6E1", minHeight: "100vh", fontFamily: "system-ui", padding: "2rem" }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <h1 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "0.25rem" }}>Coindle Dashboard</h1>
        <p style={{ color: "#9B97A0", fontSize: "0.875rem", marginBottom: "2rem" }}>Analytics powered by Supabase</p>

        {/* Stat cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
          {cards.map((c) => (
            <div key={c.label} style={{ background: "#22262E", borderRadius: 12, padding: "1.25rem", border: "1px solid #343A45" }}>
              <div style={{ color: "#9B97A0", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.5rem" }}>{c.label}</div>
              <div style={{ fontSize: "1.75rem", fontWeight: 700, color: c.color }}>{c.value}</div>
            </div>
          ))}
        </div>

        {/* Recent games table */}
        <h2 style={{ fontSize: "1.125rem", fontWeight: 600, marginBottom: "1rem" }}>Recent Games</h2>
        <div style={{ background: "#22262E", borderRadius: 12, border: "1px solid #343A45", overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.875rem" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #343A45" }}>
                {["Time", "Mode", "Difficulty", "Result", "Guesses", "Answer", "Platform"].map((h) => (
                  <th key={h} style={{ padding: "0.75rem 1rem", textAlign: "left", color: "#9B97A0", fontWeight: 500, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {stats.recent.map((e) => (
                <tr key={e.id} style={{ borderBottom: "1px solid #2A2F38" }}>
                  <td style={{ padding: "0.625rem 1rem", color: "#9B97A0" }}>
                    {new Date(e.created_at).toLocaleString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                  </td>
                  <td style={{ padding: "0.625rem 1rem" }}>
                    <span style={{ background: e.mode === "daily" ? "#1E2A42" : "#2E1E42", color: e.mode === "daily" ? "#5B8DEF" : "#A78BFA", padding: "2px 8px", borderRadius: 6, fontSize: "0.75rem" }}>{e.mode}</span>
                  </td>
                  <td style={{ padding: "0.625rem 1rem", color: "#E8E6E1" }}>{e.difficulty}</td>
                  <td style={{ padding: "0.625rem 1rem" }}>
                    <span style={{ color: e.result === "win" ? "#4ADE80" : "#F87171", fontWeight: 600 }}>{e.result === "win" ? "W" : "L"}</span>
                  </td>
                  <td style={{ padding: "0.625rem 1rem", color: "#E8E6E1" }}>{e.guesses}/6</td>
                  <td style={{ padding: "0.625rem 1rem", fontWeight: 600, color: "#E8E6E1" }}>{e.answer}</td>
                  <td style={{ padding: "0.625rem 1rem", color: "#9B97A0" }}>{e.platform}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
