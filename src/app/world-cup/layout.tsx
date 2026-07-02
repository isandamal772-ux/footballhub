import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'FIFA World Cup Standings, Brackets & Timetable',
  description: 'Get the complete FIFA World Cup coverage: live group standings, interactive knockout brackets, full tournament timetable schedule, stadiums, and Golden Boot rankings.',
  keywords: ['world cup', 'world cup brackets', 'world cup schedule', 'fifa world cup', 'golden boot leaderboards', 'football standings'],
};

export default function WorldCupLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
