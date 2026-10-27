import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ContractGuard - Legal Contract Risk Detection (RAG)',
  description: 'Retrieval-Augmented Generation for Legal Contract Risk Detection against WorldCC Corporate Playbooks',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-900 antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
