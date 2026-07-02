import { Metadata } from 'next';
import { db } from '@/lib/db';

interface Props {
  params: Promise<{ id: string }>;
  children: React.ReactNode;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  
  try {
    const match = await db.match.findUnique({
      where: { id }
    });

    if (!match) {
      return {
        title: 'Match Center | World Football Hub',
      };
    }

    const teamAName = match.teamA?.name || 'Team A';
    const teamBName = match.teamB?.name || 'Team B';

    return {
      title: `${teamAName} vs ${teamBName} Live Scores & Stream`,
      description: `Watch ${teamAName} vs ${teamBName} live stream on World Football Hub. Real-time scores, goal updates, play-by-play commentary, lineup formations, and live chat.`,
      keywords: [`${teamAName} vs ${teamBName}`, `${teamAName} vs ${teamBName} live score`, "live stream", "match commentary", "football live scores"],
    };
  } catch (error) {
    return {
      title: 'Match Center | World Football Hub',
    };
  }
}

export default function MatchLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
