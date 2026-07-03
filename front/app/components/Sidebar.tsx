import Link from "next/link";

export default function Sidebar() {
    return (
        <aside className="sticky top-0 h-screen w-64 bg-slate-900 text-slate-50 flex flex-col border-r border-slate-800 shrink-0">
            <div className="p-6 text-2xl font-bold border-b border-slate-800">
                Alunão<span className="text-blue-500">.</span>
            </div>

            <nav className="flex-1 p-4 space-y-2">
                <Link
                    href="/home"
                    className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800 transition-colors duration-200 text-slate-300 hover:text-white group"
                >
                    <span className="font-medium">Home</span>
                </Link>

                <Link
                    href="/usuarios"
                    className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800 transition-colors duration-200 text-slate-300 hover:text-white group"
                >
                    <span className="font-medium">Usuários</span>
                </Link>
            </nav>
        </aside>
    );
}