import { desc, sql } from "drizzle-orm";
import { db } from "@/db";
import { gameResults } from "@/db/schema";
import { GAMES, type GameSlug } from "@/lib/games";

export type PlatformStats = {
  attempts: number;
  players: number;
  stars: number;
  perGame: Record<GameSlug, number>;
  recent: Array<{
    id: number;
    gameSlug: string;
    stars: number;
    level: number;
    createdAt: string;
    playerName: string;
  }>;
};

export const EMPTY_STATS: PlatformStats = {
  attempts: 0,
  players: 0,
  stars: 0,
  perGame: GAMES.reduce(
    (acc, game) => {
      acc[game.slug] = 0;
      return acc;
    },
    {} as Record<GameSlug, number>,
  ),
  recent: [],
};

export async function loadPlatformStats(): Promise<PlatformStats> {
  try {
    const [totals] = await db
      .select({
        attempts: sql<number>`count(*)::int`,
        players: sql<number>`count(distinct ${gameResults.clientId})::int`,
        stars: sql<number>`coalesce(sum(${gameResults.stars}), 0)::int`,
      })
      .from(gameResults);

    const grouped = await db
      .select({
        slug: gameResults.gameSlug,
        attempts: sql<number>`count(*)::int`,
      })
      .from(gameResults)
      .groupBy(gameResults.gameSlug);

    const recent = await db
      .select({
        id: gameResults.id,
        gameSlug: gameResults.gameSlug,
        stars: gameResults.stars,
        level: gameResults.level,
        createdAt: gameResults.createdAt,
        playerName: gameResults.playerName,
      })
      .from(gameResults)
      .orderBy(desc(gameResults.createdAt))
      .limit(5);

    const perGame = { ...EMPTY_STATS.perGame };
    for (const row of grouped) {
      if (row.slug in perGame) {
        perGame[row.slug as GameSlug] = row.attempts;
      }
    }

    return {
      attempts: totals?.attempts ?? 0,
      players: totals?.players ?? 0,
      stars: totals?.stars ?? 0,
      perGame,
      recent: recent.map((row) => ({
        ...row,
        createdAt: row.createdAt.toISOString(),
      })),
    };
  } catch {
    return EMPTY_STATS;
  }
}
