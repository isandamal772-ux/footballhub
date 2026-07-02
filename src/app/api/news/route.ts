import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { cache } from '@/lib/redis';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const trending = searchParams.get('trending');

    let news;
    if (trending === 'true') {
      news = await cache.remember('trending-news', 10, async () => {
        return await db.news.findMany({
          where: { trending: true }
        });
      });
    } else {
      news = await cache.remember('all-news', 10, async () => {
        return await db.news.findMany();
      });
    }

    return NextResponse.json(news);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch news" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, summary, content, imageUrl, trending, tags } = body;

    if (!title || !content) {
      return NextResponse.json({ error: "Title and content are required" }, { status: 400 });
    }

    // Slug generation
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    const newNews = await db.news.create({
      data: {
        title,
        slug,
        summary: summary || title.substring(0, 100),
        content,
        imageUrl: imageUrl || "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=800&auto=format&fit=crop",
        trending: !!trending,
        tags: tags || ""
      }
    });

    // Clear caches
    await cache.del('all-news');
    await cache.del('trending-news');

    return NextResponse.json(newNews, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to create news article" }, { status: 500 });
  }
}
