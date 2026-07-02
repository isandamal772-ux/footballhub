import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { cache } from '@/lib/redis';

export async function GET() {
  try {
    const teams = await cache.remember('all-teams', 30, async () => {
      return await db.team.findMany({
        include: { players: true }
      });
    });
    return NextResponse.json(teams);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch teams" }, { status: 500 });
  }
}
