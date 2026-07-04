import { MetadataRoute } from 'next';
import { db } from '@/lib/db';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://footballhub.asia';

  // Base routes
  const staticRoutes = [
    '',
    '/world-cup',
    '/world-cup/groups',
    '/teams',
    '/players',
    '/compare',
    '/favorites',
    '/admin',
    '/about',
    '/contact',
    '/privacy-policy',
    '/terms-of-service'
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1.0 : (['/about', '/contact', '/privacy-policy', '/terms-of-service'].includes(route) ? 0.4 : 0.8),
  }));

  // Fetch dynamic items
  let teams: any[] = [];
  let players: any[] = [];
  let matches: any[] = [];
  let news: any[] = [];

  try {
    teams = await db.team.findMany();
    players = await db.player.findMany();
    matches = await db.match.findMany();
    news = await db.news.findMany();
  } catch (error) {
    console.error("Error fetching sitemap dynamic paths:", error);
  }

  const teamRoutes = teams.map((t) => ({
    url: `${baseUrl}/teams/${t.id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  const playerRoutes = players.map((p) => ({
    url: `${baseUrl}/players/${p.id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  const matchRoutes = matches.map((m) => ({
    url: `${baseUrl}/match/${m.id}`,
    lastModified: new Date(),
    changeFrequency: 'hourly' as const,
    priority: 0.7,
  }));

  const newsRoutes = news.map((n) => ({
    url: `${baseUrl}/news/${n.slug}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...teamRoutes, ...playerRoutes, ...matchRoutes, ...newsRoutes];
}
