
"use client";
import Sidebar from "../components/Sidebar";

export default function SistemaLayout({children}: {children: React.ReactNode}) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <Sidebar />
      <div className="main-content">
        {children}
      </div>
    </div>
  );
}