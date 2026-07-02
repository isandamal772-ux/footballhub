import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { cache } from '@/lib/redis';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    // Cache individual match details for 2 seconds to match fast commentary updates
    const match = await cache.remember(`match-detail-${id}`, 2, async () => {
      return await db.match.findUnique({
        where: { id },
        include: {
          teamA: true,
          teamB: true
        }
      });
    });

    if (!match) {
      return NextResponse.json({ error: "Match not found" }, { status: 404 });
    }

    return NextResponse.json(match);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch match details" }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const updatedMatch = await db.match.update({
      where: { id },
      data: body
    });

    // Clear caches
    await cache.del('all-matches');
    await cache.del(`match-detail-${id}`);

    return NextResponse.json(updatedMatch);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to update match" }, { status: 500 });
  }
}
