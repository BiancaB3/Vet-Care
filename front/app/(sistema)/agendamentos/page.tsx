'use client'
import { atualizarAgendamento, excluirAgendamento, listarAgendamentos } from "@/app/services/agendamentoService";
import { listarPets } from "@/app/services/petService";
import { listarTutores } from "@/app/services/tutorService";
import { AgendamentoResponse } from "@/app/types/agendamento";
import { PetResponse } from "@/app/types/pet";
import { TutorResponse } from "@/app/types/tutor";
import { pushNotification } from "@/app/redux/slices/notificationsSlice";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import VetCareAgendaSection, { StatusFilter } from "@/app/components/VetCareAgendaSection";

export default function Agendamentos() {

    const [agendamentos, setAgendamentos] = useState<AgendamentoResponse[]>([]);
    const [pets, setPets] = useState<PetResponse[]>([]);
    const [tutores, setTutores] = useState<TutorResponse[]>([]);
    const [agendaView, setAgendaView] = useState<'list' | 'calendar'>('list');
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
    const [appointmentDetailsModal, setAppointmentDetailsModal] = useState<number | null>(null);

    const dispatch = useDispatch();
    const router = useRouter();

    useEffect(() => {
        carregarDados();
    }, []);

    const carregarDados = async () => {
        try {
            const [dadosAgendamentos, dadosPets, dadosTutores] = await Promise.all([
                listarAgendamentos(),
                listarPets(),
                listarTutores(),
            ]);
            setAgendamentos(dadosAgendamentos);
            setPets(dadosPets);
            setTutores(dadosTutores);
        } catch (error) {
            alert("Erro ao carregar dados da agenda!");
            console.error(error);
        }
    }

    const handleConfirmar = async (agendamento: AgendamentoResponse) => {
        try {
            await atualizarAgendamento(agendamento.id, {
                dataHora: agendamento.dataHora,
                observacoes: agendamento.observacoes,
                status: 'CONFIRMADO',
                pet: { id: agendamento.petId },
            });

            setAgendamentos((prev) =>
                prev.map((a) => (a.id === agendamento.id ? { ...a, status: 'CONFIRMADO' } : a))
            );

            dispatch(pushNotification({ message: 'Consulta atualizada com sucesso', type: 'edicao' }));

            setAppointmentDetailsModal(null);
        } catch (error) {
            alert("Erro ao confirmar consulta!");
            console.error(error);
        }
    }

    const handleExcluir = async (agendamento: AgendamentoResponse) => {
        if (!window.confirm('Deseja realmente remover esta consulta?')) {
            return;
        }

        try {
            await excluirAgendamento(agendamento.id);
            setAgendamentos((prev) => prev.filter((a) => a.id !== agendamento.id));
            dispatch(pushNotification({ message: 'Consulta removida', type: 'cancelamento' }));
            setAppointmentDetailsModal(null);
        } catch (error) {
            alert("Erro ao remover consulta!");
            console.error(error);
        }
    }

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
                    Agenda de Consultas
                </h1>
                <Link
                    href="/agendamentos/novo"
                    className="inline-flex items-center gap-2 bg-primary hover:bg-secondary text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm"
                >
                    <span className="text-xl">+</span> Novo Agendamento
                </Link>
            </div>

            <VetCareAgendaSection
                currentVetAppointments={agendamentos}
                currentVetPets={pets}
                currentVetTutors={tutores}
                agendaView={agendaView}
                searchQuery={searchQuery}
                statusFilter={statusFilter}
                appointmentDetailsModal={appointmentDetailsModal}
                onSetAgendaView={setAgendaView}
                onSearchQueryChange={setSearchQuery}
                onStatusFilterChange={setStatusFilter}
                onOpenAppointmentModal={() => router.push('/agendamentos/novo')}
                onSetAppointmentDetailsModal={setAppointmentDetailsModal}
                onConfirmar={handleConfirmar}
                onExcluir={handleExcluir}
            />
        </div>
    )
}
