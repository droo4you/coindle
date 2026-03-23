"use client";

import { useTheme } from "@/hooks/useTheme";
import { useGameContext } from "@/context/GameContext";
import InfoModal from "./InfoModal";
import StatsModal from "./StatsModal";

export default function Header() {
  const { dark, toggle } = useTheme();
  const { mode, switchMode, difficulty, setDifficulty } = useGameContext();

  return (
    <header className="mx-auto w-full max-w-lg space-y-3">
      {/* Top row: logo + theme toggle */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
          <span style={{ color: "var(--accent)" }}>Coin</span>
          <span style={{ color: "var(--text)" }}>dle</span>
        </h1>

        <div className="flex items-center gap-2">
          <StatsModal />
          <InfoModal />
          <button
            onClick={toggle}
            className="rounded-lg p-2 text-lg transition-colors"
            style={{ background: "var(--bg-surface-2)" }}
            aria-label="Toggle theme"
          >
            {dark ? "☀️" : "🌙"}
          </button>
        </div>
      </div>

      {/* Subtitle */}
      <p className="text-xs" style={{ color: "var(--text-muted)" }}>
        Guess the mystery crypto — powered by{" "}
        <span className="font-semibold" style={{ color: "var(--accent)" }}>
          Pyth
        </span>
      </p>

      {/* Mode + Difficulty toggles */}
      <div className="flex gap-2">
        {/* Mode toggle */}
        <div
          className="flex flex-1 overflow-hidden rounded-xl"
          style={{
            background: "var(--bg-surface-2)",
            border: "1px solid var(--border-light)",
          }}
        >
          <button
            onClick={() => switchMode("daily")}
            className="flex-1 py-2 text-xs font-semibold transition-all"
            style={{
              background:
                mode === "daily" ? "var(--accent)" : "transparent",
              color: mode === "daily" ? "white" : "var(--text-muted)",
            }}
          >
            Daily
          </button>
          <button
            onClick={() => switchMode("freeplay")}
            className="flex-1 py-2 text-xs font-semibold transition-all"
            style={{
              background:
                mode === "freeplay" ? "var(--accent)" : "transparent",
              color: mode === "freeplay" ? "white" : "var(--text-muted)",
            }}
          >
            Free Play
          </button>
        </div>

        {/* Difficulty toggle */}
        <div
          className="flex overflow-hidden rounded-xl"
          style={{
            background: "var(--bg-surface-2)",
            border: "1px solid var(--border-light)",
          }}
        >
          <button
            onClick={() => setDifficulty("easy")}
            className="px-3 py-2 text-xs font-semibold transition-all"
            style={{
              background:
                difficulty === "easy" ? "var(--accent)" : "transparent",
              color: difficulty === "easy" ? "white" : "var(--text-muted)",
            }}
          >
            Easy
          </button>
          <button
            onClick={() => setDifficulty("hard")}
            className="px-3 py-2 text-xs font-semibold transition-all"
            style={{
              background:
                difficulty === "hard" ? "var(--accent)" : "transparent",
              color: difficulty === "hard" ? "white" : "var(--text-muted)",
            }}
          >
            Hard
          </button>
        </div>
      </div>
    </header>
  );
}
