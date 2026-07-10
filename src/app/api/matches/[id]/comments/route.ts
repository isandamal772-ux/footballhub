import { NextRequest, NextResponse } from 'next/server';
import { cache } from '@/lib/redis';

export const dynamic = 'force-dynamic';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { nickname, text } = body;

    if (!nickname?.trim() || !text?.trim()) {
      return NextResponse.json({ error: "Nickname and text are required" }, { status: 400 });
    }

    const { mockStore } = require('@/lib/db');
    const match = mockStore.matches.find((m: any) => m.id === id);
    if (!match) {
      return NextResponse.json({ error: "Match not found" }, { status: 404 });
    }

    // Load existing comments
    let commentsList: any[] = [];
    if (match.comments) {
      try {
        commentsList = JSON.parse(match.comments);
      } catch (e) {}
    } else {
      // Seed with some default fan comments if empty to start conversation
      commentsList = [
        { user: "Diego_99", flag: "🇦🇷", text: "Vamos! Best of luck to the boys today!", time: "10 mins ago" },
        { user: "KylianFanClub", flag: "🇫🇷", text: "Allez Les Bleus! Easy win coming up.", time: "7 mins ago" }
      ];
    }

    // Append new comment
    const newComment = {
      user: nickname.trim(),
      flag: "💬",
      text: text.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    commentsList.push(newComment);

    // Save back to db
    match.comments = JSON.stringify(commentsList);

    // Clear caches
    await cache.del(`match-detail-${id}`);

    return NextResponse.json({ success: true, comments: commentsList });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to post comment" }, { status: 550 });
  }
}
