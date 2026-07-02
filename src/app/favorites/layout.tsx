import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My Favorite Players & Teams Dashboard',
  description: 'Access your personalized football dashboard at World Football Hub. View real-time scores, stats, and updates for your favorited teams and players.',
  keywords: ['favorite teams', 'favorite players', 'personalized football dashboard', 'live score bookmarks', 'my football hub'],
};

export default function FavoritesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
