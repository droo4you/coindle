"use client";

import { GameProvider } from "@/context/GameContext";
import Header from "@/components/Header";
import GameBoard from "@/components/GameBoard";

export default function Home() {
  return (
    <GameProvider>
      <main className="flex min-h-screen flex-col items-center px-4 pb-8 pt-6 sm:pt-10">
        <Header />
        <div className="mt-6 w-full">
          <GameBoard />
        </div>

        <footer
          className="mt-auto pt-8 text-center text-xs"
          style={{ color: "var(--text-dim)" }}
        >
          Built for the Pyth Community Hackathon 2026
        </footer>
      </main>
    </GameProvider>
  );
}
