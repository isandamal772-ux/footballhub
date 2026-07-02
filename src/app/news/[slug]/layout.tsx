import { Metadata } from 'next';
import { db } from '@/lib/db';

interface Props {
  params: Promise<{ slug: string }>;
  children: React.ReactNode;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  
  try {
    const article = await db.news.findUnique({
      where: { slug }
    });

    if (!article) {
      return {
        title: 'Football News | World Football Hub',
      };
    }

    return {
      title: `${article.title}`,
      description: article.summary || `${article.title} - Read the latest trending football update on World Football Hub.`,
      keywords: ["football news", "latest updates", "soccer trends", article.title],
    };
  } catch (error) {
    return {
      title: 'Football News | World Football Hub',
    };
  }
}

export default function NewsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
