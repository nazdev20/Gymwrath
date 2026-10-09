import type { Metadata } from 'next';
import '../src/index.css';

export const metadata: Metadata = {
  title: 'GymWrath — Channel the fire. Own the result.',
  description: 'Set the target. Execute the plan. Prove the progress. GymWrath brings strength training, nutrition, and coaching progress into one focused platform.',
  applicationName: 'GymWrath',
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