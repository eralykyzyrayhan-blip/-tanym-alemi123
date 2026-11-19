import { loadPlatformStats } from "@/lib/platform-stats";

export const dynamic = "force-dynamic";

export async function GET() {
  const stats = await loadPlatformStats();
  return Response.json({ ok: true, stats });
}
