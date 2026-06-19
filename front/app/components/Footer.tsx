
export default function Footer() {
  return (
    <footer className="w-full mt-auto py-6 bg-blue-600 text-white text-center">
      <div className="max-w-7xl mx-auto px-4">
        <span className="font-semibold">VetCare</span> &copy; {new Date().getFullYear()} - Todos os direitos reservados.
      </div>
    </footer>
  );
}
