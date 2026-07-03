'use client'
import { criarAgendamento } from "@/app/services/agendamentoService";
import { listarPets } from "@/app/services/petService";
import { listarTutores } from "@/app/services/tutorService";
import { PetResponse } from "@/app/types/pet";
import { TutorResponse } from "@/app/types/tutor";
import { getDraft, saveDraft, clearDraft, AppointmentDraft } from "@/app/lib/formDraft";
import { pushNotification } from "@/app/redux/slices/notificationsSlice";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

export default function AgendamentoForm() {
    const [pets, setPets] = useState<PetResponse[]>([]);
    const [tutores, setTutores] = useState<TutorResponse[]>([]);
    const [form, setForm] = useState<AppointmentDraft>({ petId: '', date: '', time: '', reason: '' });
    const [showDraft, setShowDraft] = useState(false);

    const router = useRouter();
    const dispatch = useDispatch();

    useEffect(() => {
        carregarDados();

        const draft = getDraft('appointment');
        if (draft) {
            setForm(draft);
            setShowDraft(true);
        }
    }, []);

    const carregarDados = async () => {
        try {
            const [dadosPets, dadosTutores] = await Promise.all([listarPets(), listarTutores()]);
            setPets(dadosPets);
            setTutores(dadosTutores);
        } catch (error) {
            alert("Erro ao carregar pets e tutores!");
            console.error(error);
        }
    }

    const nomeTutor = (tutorId: number | null): string => {
        if (tutorId == null) return '';
        const tutor = tutores.find((t) => t.id === tutorId);
        return tutor ? tutor.nome : '';
    }

    const handleChange = (campo: keyof AppointmentDraft, valor: string) => {
        const atualizado = { ...form, [campo]: valor };
        setForm(atualizado);
        saveDraft('appointment', { [campo]: valor });
    }

    const handleDiscardDraft = () => {
        clearDraft('appointment');
        setForm({ petId: '', date: '', time: '', reason: '' });
        setShowDraft(false);
    }

    const handleSalvar = async (formData: FormData) => {
        try {
            const dataHora = `${form.date}T${form.time}:00`;

            const agendamento = await criarAgendamento({
                dataHora,
                observacoes: form.reason,
                pet: { id: Number(form.petId) },
            });

            dispatch(pushNotification({ message: `Consulta agendada para ${form.date}`, type: 'cadastro' }));

            clearDraft('appointment');
            router.push("/agendamentos");
        } catch (error) {
            alert("Erro ao agendar consulta!");
            console.error(error);
        }
    }

    return (
        <form action={handleSalvar} className="w-full">
            {showDraft && (
                <div className="mb-6 p-3 bg-amber-50 text-amber-800 rounded-xl text-sm flex items-center justify-between gap-3 border border-amber-200">
                    <span>Rascunho recuperado.</span>
                    <button type="button" onClick={handleDiscardDraft} className="shrink-0 px-3 py-1.5 font-semibold rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900">
                        Descartar
                    </button>
                </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                <div className="flex flex-col gap-1.5 md:col-span-2">
                    <label className="text-sm font-semibold text-slate-700">
                        Pet
                    </label>
                    <select
                        required
                        value={form.petId}
                        onChange={(e) => handleChange('petId', e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-primary transition-all outline-none"
                    >
                        <option value="">Selecione o pet</option>
                        {pets.map((pet) => (
                            <option key={pet.id} value={pet.id}>
                                {pet.nome}{nomeTutor(pet.tutorId) ? ` - ${nomeTutor(pet.tutorId)}` : ''}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-slate-700">
                        Data
                    </label>
                    <input
                        type="date"
                        required
                        value={form.date}
                        onChange={(e) => handleChange('date', e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-primary transition-all outline-none"
                    />
                </div>

                <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-slate-700">
                        Hora
                    </label>
                    <input
                        type="time"
                        required
                        value={form.time}
                        onChange={(e) => handleChange('time', e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-primary transition-all outline-none"
                    />
                </div>

                <div className="flex flex-col gap-1.5 md:col-span-2">
                    <label className="text-sm font-semibold text-slate-700">
                        Motivo da consulta
                    </label>
                    <textarea
                        required
                        rows={3}
                        value={form.reason}
                        onChange={(e) => handleChange('reason', e.target.value)}
                        placeholder="Descreva o motivo da consulta"
                        className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-primary transition-all outline-none resize-none"
                    />
                </div>

                <div className="md:col-span-2 flex items-center justify-end gap-6 pt-6 mt-6 border-t border-slate-100">
                    <Link
                        href="/agendamentos"
                        className="text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors"
                    >
                        CANCELAR
                    </Link>
                    <button
                        type="submit"
                        className="px-10 py-3 bg-primary hover:bg-secondary text-white font-bold rounded-xl shadow-lg shadow-primary/30 transition-all active:scale-95"
                    >
                        AGENDAR CONSULTA
                    </button>
                </div>
            </div>
        </form>
    )
}
