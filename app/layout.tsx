import type { Metadata } from 'next';
import '../src/index.css';

export const metadata: Metadata = {
  title: 'GymWrath',
  description: 'Fitness coaching and workout management platform',
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}