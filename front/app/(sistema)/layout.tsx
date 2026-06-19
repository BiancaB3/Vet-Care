export default function SistemaLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="bg-white min-h-screen">
        <header className="bg-blue-800 text-white p-4 text-center font-bold">Dashboard VetCare</header>
        <main>{children}</main>
      </body>
    </html>
  );
}
