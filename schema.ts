import { index, integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const gameResults = pgTable(
  "game_results",
  {
    id: serial("id").primaryKey(),
    clientId: text("client_id").notNull(),
    playerName: text("player_name").notNull().default("Оқушы"),
    gameSlug: text("game_slug").notNull(),
    level: integer("level").notNull(),
    stars: integer("stars").notNull().default(0),
    correct: integer("correct").notNull().default(0),
    wrong: integer("wrong").notNull().default(0),
    total: integer("total").notNull().default(0),
    helpUsed: integer("help_used").notNull().default(0),
    durationMs: integer("duration_ms").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("game_results_slug_idx").on(table.gameSlug),
    index("game_results_created_idx").on(table.createdAt),
  ],
);

export type GameResultRow = typeof gameResults.$inferSelect;
export type NewGameResultRow = typeof gameResults.$inferInsert;
