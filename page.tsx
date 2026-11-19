import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GameClient } from "@/components/game/game-client";
import { GAME_MAP, GAMES, isGameSlug } from "@/lib/games";

export function generateStaticParams() {
  return GAMES.map((game) => ({ slug: game.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  if (!isGameSlug(slug)) {
    return { title: "Ойын табылмады — TANЫM" };
  }
  const game = GAME_MAP[slug];
  return {
    title: `${game.title} — TANЫM`,
    description: game.description,
  };
}

export default async function GamePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!isGameSlug(slug)) {
    notFound();
  }
  return <GameClient meta={GAME_MAP[slug]} />;
}
