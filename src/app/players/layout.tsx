import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Football Player Profiles & Stats Database',
  description: 'Explore the complete directory of the 100 best football players in the world. Review detailed career stats, rating averages, goal metrics, transfer values, and histories.',
  keywords: ['football players', 'player profiles', 'soccer stats', 'player ranking', 'top 100 players', 'player market value'],
};

export default function PlayersLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
