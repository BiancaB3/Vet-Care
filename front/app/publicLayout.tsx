export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="bg-slate-50 min-h-screen">
        <header className="bg-blue-600 text-white p-4 text-center font-bold">VetCare Público</header>
        <main>{children}</main>
      </body>
    </html>
  );
}
