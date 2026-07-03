export type EnumStatusAgendamento = 'AGENDADO' | 'CONFIRMADO' | 'CANCELADO' | 'REALIZADO';

export interface AgendamentoRequest {
  dataHora: string;
  observacoes?: string;
  status?: EnumStatusAgendamento;
  pet: { id: number };
}

export interface AgendamentoResponse {
  id: number;
  petId: number;
  veterinarioId: number;
  dataHora: string;
  observacoes: string;
  status: EnumStatusAgendamento;
}
