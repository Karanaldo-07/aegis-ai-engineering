import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AEGIS — AI Engineering OS',
  description: 'AI-native software engineering control plane for autonomous delivery, testing and security.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
