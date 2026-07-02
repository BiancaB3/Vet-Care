'use client';

import { useState } from 'react';
import { Calendar, MessageCircle, X } from 'lucide-react';
import type { Appointment, Pet, Tutor } from '../../types/VetContext';
import VetCareAgendaSection from '../../components/VetCareAgendaSection';

type AgendaFeatureContainerProps = {
  currentVetAppointments: Appointment[];
  currentVetPets: Pet[];
  currentVetTutors: Tutor[];
  onOpenAppointmentModal: () => void;
  onDeleteAppointment: (id: string) => void;
  onToggleAppointmentConfirmation: (id: string, confirmed: boolean) => void;
  onShowToast: (message: string) => void;
};

export default function AgendaFeatureContainer({
  currentVetAppointments,
  currentVetPets,
  currentVetTutors,
  onOpenAppointmentModal,
  onDeleteAppointment,
  onToggleAppointmentConfirmation,
  onShowToast,
}: AgendaFeatureContainerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'agendado' | 'concluido' | 'cancelado'>('all');
  const [agendaView, setAgendaView] = useState<'list' | 'calendar'>('list');
  const [appointmentDetailsModal, setAppointmentDetailsModal] = useState<string | null>(null);

  return (
    <>
      <VetCareAgendaSection
        currentVetAppointments={currentVetAppointments}
        currentVetPets={currentVetPets}
        currentVetTutors={currentVetTutors}
        agendaView={agendaView}
        searchQuery={searchQuery}
        statusFilter={statusFilter}
        appointmentDetailsModal={appointmentDetailsModal}
        onSetAgendaView={setAgendaView}
        onSearchQueryChange={setSearchQuery}
        onStatusFilterChange={setStatusFilter}
        onOpenAppointmentModal={onOpenAppointmentModal}
        onSetAppointmentDetailsModal={setAppointmentDetailsModal}
        onDeleteAppointment={onDeleteAppointment}
      />

      {appointmentDetailsModal && (() => {
        const appointment = currentVetAppointments.find((item) => item.id === appointmentDetailsModal);
        const pet = appointment ? currentVetPets.find((item) => item.id === appointment.petId) : null;
        const tutor = pet ? currentVetTutors.find((item) => item.id === pet.tutorId) : null;

        if (!appointment || !pet || !tutor) return null;

        const handleWhatsAppMessage = () => {
          const message = `OlÃ¡ ${tutor.name}! Lembrando da consulta do ${pet.name} agendada para ${appointment.date} Ã s ${appointment.time}. Motivo: ${appointment.reason}. ${appointment.confirmed ? 'Consulta confirmada!' : 'Aguardando confirmaÃ§Ã£o.'}`;
          const whatsappUrl = `https://wa.me/55${tutor.phone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
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
                <button onClick={() => setAppointmentDetailsModal(null)} className="p-2 hover:bg-slate-100 rounded-lg">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-600 mb-1">Data</label>
                    <p className="text-lg font-medium text-slate-900">{appointment.date}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-600 mb-1">Horario</label>
                    <p className="text-lg font-medium text-slate-900">{appointment.time}</p>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-600 mb-1">Pet</label>
                  <p className="text-lg font-medium text-slate-900">{pet.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-600 mb-1">Tutor</label>
                  <p className="text-lg font-medium text-slate-900">{tutor.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-600 mb-1">Descricao</label>
                  <p className="text-slate-700">{appointment.reason}</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-600 mb-1">Status</label>
                  <div className="flex items-center gap-3">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        appointment.confirmed ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {appointment.confirmed ? 'Confirmado' : 'Pendente Confirmacao'}
                    </span>
                    <button
                      onClick={() => {
                        onToggleAppointmentConfirmation(appointment.id, !appointment.confirmed);
                        onShowToast(`Consulta ${!appointment.confirmed ? 'confirmada' : 'marcada como pendente'}!`);
                      }}
                      className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                        appointment.confirmed ? 'bg-yellow-500 hover:bg-yellow-600 text-white' : 'bg-green-500 hover:bg-green-600 text-white'
                      }`}
                    >
                      {appointment.confirmed ? 'Marcar Pendente' : 'Confirmar'}
                    </button>
                  </div>
                </div>
                <div className="pt-4 border-t">
                  <button
                    onClick={handleWhatsAppMessage}
                    className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl transition-all"
                  >
                    <MessageCircle className="w-5 h-5" />
                    Enviar Mensagem WhatsApp
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </>
  );
}

