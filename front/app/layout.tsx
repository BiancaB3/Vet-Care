import type { Metadata } from 'next';
import { AuthProvider } from './types/AuthContext';
import { DraftProvider } from './types/DraftContext';
import { VetProvider } from './types/VetContext';
import StoreProvider from './redux/StoreProvider';
import './globals.css';

export const metadata: Metadata = {
  title: 'VetCare - Sistema de Gestão para Clínicas Veterinárias',
  description: 'Controle de prontuários e agendamentos de pets',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="antialiased bg-gradient-to-br from-slate-50 via-blue-50 to-emerald-50">
        <StoreProvider>
          <AuthProvider>
            <VetProvider>
              <DraftProvider>{children}</DraftProvider>
            </VetProvider>
          </AuthProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
