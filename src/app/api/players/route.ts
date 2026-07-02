import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { cache } from '@/lib/redis';

export async function GET() {
  try {
    const players = await cache.remember('all-players', 30, async () => {
      return await db.player.findMany({
        include: { team: true }
      });
    });
    return NextResponse.json(players);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch players" }, { status: 500 });
  }
}
