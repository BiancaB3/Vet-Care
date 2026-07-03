export interface PetRequest {
  nome: string;
  especie: string;
  raca?: string | null;
  idade?: number | null;
  peso?: number | null;
  sexo: string;
  cor: string;
  tutor: { id: number };
}

export interface PetResponse {
  id: number;
  nome: string;
  especie: string;
  raca: string | null;
  idade: number | null;
  peso: number | null;
  sexo: string;
  cor: string;
  tutorId: number | null;
}
