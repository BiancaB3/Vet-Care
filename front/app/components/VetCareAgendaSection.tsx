'use client';

import { useState } from 'react';
import { Calendar, CalendarX, CheckCircle, Search, User, X } from 'lucide-react';
import type { EnumStatusAgendamento, AgendamentoResponse } from '../types/agendamento';
import type { PetResponse } from '../types/pet';
import type { TutorResponse } from '../types/tutor';

export type StatusFilter = 'all' | EnumStatusAgendamento;

export type VetCareAgendaSectionProps = {
  currentVetAppointments: AgendamentoResponse[];
  currentVetPets: PetResponse[];
  currentVetTutors: TutorResponse[];
  agendaView: 'list' | 'calendar';
  searchQuery: string;
  statusFilter: StatusFilter;
  appointmentDetailsModal: number | null;
  onSetAgendaView: (value: 'list' | 'calendar') => void;
  onSearchQueryChange: (value: string) => void;
  onStatusFilterChange: (value: StatusFilter) => void;
  onOpenAppointmentModal: () => void;
  onSetAppointmentDetailsModal: (value: number | null) => void;
  onConfirmar: (agendamento: AgendamentoResponse) => void;
  onExcluir: (agendamento: AgendamentoResponse) => void;
};

function statusLabel(status: EnumStatusAgendamento): string {
  switch (status) {
    case 'AGENDADO':
      return 'Agendado';
    case 'CONFIRMADO':
      return 'Confirmado';
    case 'CANCELADO':
      return 'Cancelado';
    case 'REALIZADO':
      return 'Realizado';
    default:
      return status;
  }
}

function statusBadgeClasses(status: EnumStatusAgendamento): string {
  switch (status) {
    case 'CONFIRMADO':
      return 'bg-green-100 text-green-800';
    case 'CANCELADO':
      return 'bg-red-100 text-red-800';
    case 'REALIZADO':
      return 'bg-primary/20 text-secondary';
    case 'AGENDADO':
    default:
      return 'bg-yellow-100 text-yellow-800';
  }
}

function dataHoraToDateStr(dataHora: string): string {
  return dataHora.slice(0, 10);
}

function dataHoraToTimeStr(dataHora: string): string {
  return dataHora.slice(11, 16);
}

function CalendarView({
  appointments,
  pets,
}: {
  appointments: AgendamentoResponse[];
  pets: PetResponse[];
}) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const monthNames = [
    'Janeiro', 'Fevereiro', 'Marco', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days: Array<number | null> = [];

    for (let i = 0; i < startingDayOfWeek; i += 1) {
      days.push(null);
    }

    for (let day = 1; day <= daysInMonth; day += 1) {
      days.push(day);
    }

    return days;
  };

  const getAppointmentsForDate = (day: number) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return appointments.filter((apt) => dataHoraToDateStr(apt.dataHora) === dateStr);
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
      return newDate;
    });
  };

  const days = getDaysInMonth(currentDate);
  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'];

  return (
    <div className="calendar-container">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-slate-800">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h3>
        <div className="flex gap-2">
          <button onClick={() => navigateMonth('prev')} className="p-2 hover:bg-slate-100 rounded-lg">←</button>
          <button onClick={() => setCurrentDate(new Date())} className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90">Hoje</button>
          <button onClick={() => navigateMonth('next')} className="p-2 hover:bg-slate-100 rounded-lg">→</button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {weekDays.map((day) => (
          <div key={day} className="p-3 text-center font-semibold text-slate-600 text-sm">{day}</div>
        ))}

        {days.map((day, index) => {
          if (day === null) return <div key={index} className="p-3"></div>;

          const dayAppointments = getAppointmentsForDate(day);
          const isToday = new Date().toDateString() === new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toDateString();

          return (
            <div
              key={index}
              className={`min-h-[120px] p-2 border border-slate-200 rounded-lg ${isToday ? 'bg-primary/10 border-primary' : 'bg-white'}`}
            >
              <div className={`text-sm font-medium mb-2 ${isToday ? 'text-primary' : 'text-slate-700'}`}>{day}</div>
              <div className="space-y-1">
                {dayAppointments.slice(0, 3).map((apt) => {
                  const pet = pets.find((p) => p.id === apt.petId);
                  return (
                    <div
                      key={apt.id}
                      className={`text-xs p-1 rounded truncate ${statusBadgeClasses(apt.status)}`}
                      title={`${pet?.nome || 'Pet'}: ${apt.observacoes} - ${dataHoraToTimeStr(apt.dataHora)} (${statusLabel(apt.status)})`}
                    >
                      {pet?.nome || 'Pet'} - {dataHoraToTimeStr(apt.dataHora)}
                    </div>
                  );
                })}
                {dayAppointments.length > 3 && <div className="text-xs text-slate-500">+{dayAppointments.length - 3} mais</div>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function VetCareAgendaSection({
  currentVetAppointments,
  currentVetPets,
  currentVetTutors,
  agendaView,
  searchQuery,
  statusFilter,
  appointmentDetailsModal,
  onSetAgendaView,
  onSearchQueryChange,
  onStatusFilterChange,
  onOpenAppointmentModal,
  onSetAppointmentDetailsModal,
  onConfirmar,
  onExcluir,
}: VetCareAgendaSectionProps) {
  const filteredAppointments = currentVetAppointments.filter((apt) => {
    const pet = currentVetPets.find((p) => p.id === apt.petId);
    if (searchQuery) {
      const name = pet?.nome.toLowerCase() || '';
      if (!name.includes(searchQuery.toLowerCase())) return false;
    }
    if (statusFilter !== 'all' && apt.status !== statusFilter) return false;
    return true;
  });

  return (
    <section>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-primary">Agenda de Consultas</h2>
          <p className="text-slate-500 mt-2">Consultas agendadas</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-slate-100 rounded-lg p-1">
            <button
              onClick={() => onSetAgendaView('list')}
              className={`px-4 py-2 rounded-md font-medium transition-all ${agendaView === 'list' ? 'bg-white text-primary shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
            >
              Lista
            </button>
            <button
              onClick={() => onSetAgendaView('calendar')}
              className={`px-4 py-2 rounded-md font-medium transition-all ${agendaView === 'calendar' ? 'bg-white text-primary shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
            >
              Calendario
            </button>
          </div>
          <button
            type="button"
            onClick={onOpenAppointmentModal}
            className="flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-primary to-secondary hover:shadow-xl hover:shadow-primary/40 text-white font-bold rounded-xl transition-all shadow-lg"
          >
            <Calendar className="w-5 h-5" /> Nova Consulta
          </button>
        </div>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchQueryChange(e.target.value)}
            placeholder="Buscar consulta..."
            className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:border-primary font-medium"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => onStatusFilterChange(e.target.value as StatusFilter)}
          className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:border-primary font-medium"
        >
          <option value="all">Todos</option>
          <option value="AGENDADO">Agendado</option>
          <option value="CONFIRMADO">Confirmado</option>
          <option value="REALIZADO">Realizado</option>
          <option value="CANCELADO">Cancelado</option>
        </select>
      </div>

      {agendaView === 'list' ? (
        filteredAppointments.length === 0 ? (
          <div className="text-center py-12">
            <CalendarX className="w-12 h-12 mx-auto mb-3 text-slate-300" />
            <p className="text-slate-400">Nenhuma consulta agendada</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredAppointments.map((apt) => {
              const pet = currentVetPets.find((p) => p.id === apt.petId);
              return (
                <div key={apt.id} className="modern-card rounded-xl p-4 border border-slate-200 cursor-pointer hover:shadow-lg transition-shadow" onClick={() => onSetAppointmentDetailsModal(apt.id)}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Calendar className="w-6 h-6 text-primary" />
                      <div>
                        <h4 className="font-semibold text-text">{pet?.nome || 'Pet'}</h4>
                        <p className="text-xs text-slate-500">{dataHoraToDateStr(apt.dataHora)} - {dataHoraToTimeStr(apt.dataHora)}</p>
                        <p className="text-xs text-slate-400">{apt.observacoes}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusBadgeClasses(apt.status)}`}>
                            {statusLabel(apt.status)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <CalendarView appointments={currentVetAppointments} pets={currentVetPets} />
        </div>
      )}

      {appointmentDetailsModal != null && (() => {
        const appointment = currentVetAppointments.find((a) => a.id === appointmentDetailsModal);
        const pet = appointment ? currentVetPets.find((p) => p.id === appointment.petId) : null;
        const tutor = pet ? currentVetTutors.find((t) => t.id === pet.tutorId) : null;

        if (!appointment || !pet || !tutor) return null;

        const handleWhatsAppMessage = () => {
          const message = `Ola ${tutor.nome}! Lembrando da consulta do ${pet.nome} agendada para ${dataHoraToDateStr(appointment.dataHora)} as ${dataHoraToTimeStr(appointment.dataHora)}. Motivo: ${appointment.observacoes}. ${appointment.status === 'CONFIRMADO' ? 'Consulta confirmada!' : 'Aguardando confirmacao.'}`;
          const whatsappUrl = `https://wa.me/55${tutor.telefone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
          window.open(whatsappUrl, '_blank');
        };

        return (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl w-full max-w-lg border border-slate-200 shadow-2xl">
              <div className="p-6 border-b flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Calendar className="w-6 h-6 text-primary" />
                  <h3 className="text-2xl font-bold">Detalhes da Consulta</h3>
                </div>
                <button onClick={() => onSetAppointmentDetailsModal(null)} className="p-2 hover:bg-slate-100 rounded-lg">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-600 mb-1">Data</label>
                    <p className="text-lg font-medium text-slate-900">{dataHoraToDateStr(appointment.dataHora)}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-600 mb-1">Horario</label>
                    <p className="text-lg font-medium text-slate-900">{dataHoraToTimeStr(appointment.dataHora)}</p>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-600 mb-1">Pet</label>
                  <p className="text-lg font-medium text-slate-900">{pet.nome}</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-600 mb-1">Tutor</label>
                  <p className="text-lg font-medium text-slate-900 flex items-center gap-2">
                    <User className="w-4 h-4 text-slate-400" /> {tutor.nome}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-600 mb-1">Descricao</label>
                  <p className="text-slate-700">{appointment.observacoes}</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-600 mb-1">Status</label>
                  <div className="flex items-center gap-3">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusBadgeClasses(appointment.status)}`}>
                      {appointment.status === 'CONFIRMADO' || appointment.status === 'REALIZADO' ? <CheckCircle className="w-4 h-4 mr-1" /> : null}
                      {statusLabel(appointment.status)}
                    </span>
                  </div>
                </div>
                {appointment.status === 'AGENDADO' && (
                  <button
                    onClick={() => onConfirmar(appointment)}
                    className="w-full py-3.5 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl transition-all shadow-lg"
                  >
                    Confirmar Consulta
                  </button>
                )}
                <button
                  onClick={handleWhatsAppMessage}
                  className="w-full py-3.5 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl transition-all shadow-lg"
                >
                  Enviar lembrete no WhatsApp
                </button>
                <button
                  onClick={() => onExcluir(appointment)}
                  className="w-full py-3.5 border-2 border-red-200 text-red-600 hover:bg-red-50 font-bold rounded-xl transition-all"
                >
                  Remover Consulta
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </section>
  );
}
