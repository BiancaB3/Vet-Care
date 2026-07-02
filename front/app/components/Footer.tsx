
export default function Footer() {
  return (
    <footer className="w-full mt-auto py-6 bg-gradient-to-r from-primary to-secondary border-t border-emerald-300 text-white text-center">
      <div className="max-w-7xl mx-auto px-4">
        <span className="font-semibold">VetCare</span> &copy; {new Date().getFullYear()} - Todos os direitos reservados.
      </div>
    </footer>
  );
}
