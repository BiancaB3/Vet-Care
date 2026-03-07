import Footer from "../components/Footer";
import Header from "../components/Header";

export default function SistemaLayout({children}:
  {children: React.ReactNode}){
  return (
    <div className="flex min-h-screen bg-zinc-50 text-zinc-900 font-sans">
      <div className="flex flex-col flex-1 w-full">
        
        <Header />
        <main className="flex-1 p-4 md:p-8">
          <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-2 duration-700">
            {children}
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
  }