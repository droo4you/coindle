export async function GET() {
  const manifest = {
    accountAssociation: {
      header: "",
      payload: "",
      signature: "",
    },
    miniapp: {
      version: "1",
      name: "Coindle",
      homeUrl: "https://coindle.xyz",
      iconUrl: "https://coindle.xyz/icon-1024.png",
      splashBackgroundColor: "#1A1F2B",
      subtitle: "Daily crypto guessing game",
      description:
        "Guess today's cryptocurrency powered by Pyth price feeds. 141 coins, live prices, 6 guesses. New puzzle every day!",
      primaryCategory: "games",
      tags: ["crypto", "wordle", "pyth", "daily", "game"],
    },
  };

  return Response.json(manifest);
}
