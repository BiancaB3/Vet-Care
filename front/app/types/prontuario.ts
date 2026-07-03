export interface ProntuarioRequest {
  dataAtendimento: string;
  descricao?: string;
  diagnostico?: string;
  tratamento?: string;
  prescricao?: string;
  pet: { id: number };
  agendamento?: { id: number };
}

export interface ProntuarioResponse {
  id: number;
  petId: number;
  veterinarioId: number;
  agendamentoId: number | null;
  dataAtendimento: string;
  descricao: string;
  diagnostico: string;
  tratamento: string;
  prescricao: string;
}
