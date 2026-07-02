import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Compare Football Players Side-by-Side',
  description: 'Use our head-to-head comparison tool to analyze two football players. Compare stats: goals, assists, average ratings, age, height, and transfer values.',
  keywords: ['compare players', 'football player comparison', 'head to head stats', 'messi vs ronaldo stats', 'soccer player comparison tool'],
};

export default function CompareLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
