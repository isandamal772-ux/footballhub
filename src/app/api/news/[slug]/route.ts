import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { cache } from '@/lib/redis';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const article = await cache.remember(`news-article-${slug}`, 15, async () => {
      return await db.news.findUnique({
        where: { slug }
      });
    });

    if (!article) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    return NextResponse.json(article);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch article" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    
    // First find by slug to get ID
    const article = await db.news.findUnique({ where: { slug } });
    if (!article) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    await db.news.delete({
      where: { id: article.id }
    });

    // Clear caches
    await cache.del('all-news');
    await cache.del('trending-news');
    await cache.del(`news-article-${slug}`);

    return NextResponse.json({ message: "Article deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to delete article" }, { status: 500 });
  }
}
