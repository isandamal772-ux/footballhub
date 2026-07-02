import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'World Football National Teams Directory',
  description: 'Browse details, current FIFA rankings, recent form guides, and main head coaches for 50 world-class national football teams. View dynamic squad rosters.',
  keywords: ['national football teams', 'fifa rankings', 'team roster', 'football coaches', 'football teams standings', 'world cup squads'],
};

export default function TeamsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
