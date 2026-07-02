import { Metadata } from 'next';
import { db } from '@/lib/db';

interface Props {
  params: Promise<{ id: string }>;
  children: React.ReactNode;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  
  try {
    const team = await db.team.findUnique({
      where: { id }
    });

    if (!team) {
      return {
        title: 'Team Details | World Football Hub',
      };
    }

    return {
      title: `${team.name} Squad, Fixtures & Details`,
      description: `Explore the complete ${team.name} national football squad at World Football Hub. View recent form (${team.form}), FIFA ranking #${team.ranking}, coach ${team.coachName}, and player lineups.`,
      keywords: [team.name, `${team.name} squad`, `${team.name} players`, `${team.name} fixtures`, "football", "soccer"],
    };
  } catch (error) {
    return {
      title: 'Team Details | World Football Hub',
    };
  }
}

export default function TeamLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
