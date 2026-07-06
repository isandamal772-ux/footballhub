import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { cache } from '@/lib/redis';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Cache the matches list for 5 seconds to reduce database strain
    const matches = await cache.remember('all-matches', 5, async () => {
      return await db.match.findMany();
    });
    return NextResponse.json(matches);
  } catch (error: any) {
    console.error("API error fetching matches:", error);
    return NextResponse.json({ error: error.message || "Failed to fetch matches" }, { status: 500 });
  }
}
