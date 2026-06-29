'use client';

import { useParams } from 'next/navigation';

export default function Page() {
  const params = useParams();
  return (
    <main className="p-4">
      <h1>Detalhes do Tutor</h1>
      <p>ID do tutor: {params.id}</p>
    </main>
  );
}
