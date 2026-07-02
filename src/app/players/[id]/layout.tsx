import { Metadata } from 'next';
import { db } from '@/lib/db';

interface Props {
  params: Promise<{ id: string }>;
  children: React.ReactNode;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  
  try {
    const player = await db.player.findUnique({
      where: { id }
    });

    if (!player) {
      return {
        title: 'Player Profile | World Football Hub',
      };
    }

    return {
      title: `${player.name} - Stats, Goals & Career Info`,
      description: `Get the official player profile for ${player.name} (${player.position}, Jersey #${player.jerseyNumber}). View total goals (${player.goals}), assists (${player.assists}), appearances (${player.appearances}), ratings, and transfer value at World Football Hub.`,
      keywords: [player.name, `${player.name} stats`, `${player.name} transfer value`, `${player.name} career`, "football player profile"],
    };
  } catch (error) {
    return {
      title: 'Player Profile | World Football Hub',
    };
  }
}

export default function PlayerLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
