'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  Mail, Lock, Bell, LogOut, Calendar, Users, Dog, ClipboardList,
  Plus, Search, X, TrendingUp, CalendarX, User, CheckCircle,
  Trash2, Edit2, UserPlus, PlusCircle, FilePlus, Eye, EyeOff,
  Cat, Feather, Mouse, Turtle, MessageCircle, Check, X as XIcon
} from 'lucide-react';
import { useDispatch } from 'react-redux';
import { useVet, Veterinarian, Tutor, Pet, Appointment, Consultation } from '../context/VetContext';
import {
  useDraft,
  emptyDraftByKind,
  type AppointmentDraft,
  type PetDraft,
  type ConsultationDraft,
  type DraftKind,
} from '../context/DraftContext';
import api from '../services/api';
import { loginService } from '../services/authService';
import { listarTutores, criarTutor, atualizarTutor, excluirTutor, buscarEnderecoPorCep } from '../services/tutorService';
import { setToken, setUsuario } from '../redux/slices/authSlice';
import VetCareAuthPanel from './VetCareAuthPanel';
import VetCareDashboardHeader from './VetCareDashboardHeader';
import VetCareAgendaSection from './VetCareAgendaSection';
import VetCareTutorSection from './VetCareTutorSection';
import VetCarePetSection from './VetCarePetSection';
import VetCareProntuarioSection from './VetCareProntuarioSection';
import VetCareVeterinarioSection from './VetCareVeterinarioSection';
import VetCareTutorModal from './VetCareTutorModal';
import VetCarePetModal from './VetCarePetModal';
import VetCareAppointmentModal from './VetCareAppointmentModal';
import VetCareConsultationModal from './VetCareConsultationModal';

interface VeterinarioApi {
  id: number;
  nome: string;
  crmv: string;
  especialidade: string;
  telefone: string;
  email: string;
}

interface CalendarViewProps {
  appointments: Appointment[];
  pets: Pet[];
  onDeleteAppointment: (id: string) => void;
}

const CalendarView: React.FC<CalendarViewProps> = ({ appointments, pets, onDeleteAppointment }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }

    return days;
  };

  const getAppointmentsForDate = (day: number) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return appointments.filter(apt => apt.date === dateStr);
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
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
  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  return (
    <div className="calendar-container">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-slate-800">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h3>
        <div className="flex gap-2">
          <button
            onClick={() => navigateMonth('prev')}
            className="p-2 hover:bg-slate-100 rounded-lg"
          >
            ←
          </button>
          <button
            onClick={() => setCurrentDate(new Date())}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
          >
            Hoje
          </button>
          <button
            onClick={() => navigateMonth('next')}
            className="p-2 hover:bg-slate-100 rounded-lg"
          >
            →
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {/* Week day headers */}
        {weekDays.map(day => (
          <div key={day} className="p-3 text-center font-semibold text-slate-600 text-sm">
            {day}
          </div>
        ))}

        {/* Calendar days */}
        {days.map((day, index) => {
          if (day === null) {
            return <div key={index} className="p-3"></div>;
          }

          const dayAppointments = getAppointmentsForDate(day);
          const isToday = new Date().toDateString() === new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toDateString();

          return (
            <div
              key={index}
              className={`min-h-[120px] p-2 border border-slate-200 rounded-lg ${
                isToday ? 'bg-primary/10 border-primary' : 'bg-white'
              }`}
            >
              <div className={`text-sm font-medium mb-2 ${isToday ? 'text-primary' : 'text-slate-700'}`}>
                {day}
              </div>
              <div className="space-y-1">
                {dayAppointments.slice(0, 3).map(apt => {
                  const pet = pets.find(p => p.id === apt.petId);
                  return (
                    <div
                      key={apt.id}
                      className={`text-xs p-1 rounded truncate ${
                        apt.confirmed 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                      title={`${pet?.name || 'Pet'}: ${apt.reason} - ${apt.time} (${apt.confirmed ? 'Confirmado' : 'Pendente'})`}
                    >
                      {pet?.name || 'Pet'} - {apt.time}
                    </div>
                  );
                })}
                {dayAppointments.length > 3 && (
                  <div className="text-xs text-slate-500">
                    +{dayAppointments.length - 3} mais
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const emptyAppointmentForm = (): AppointmentDraft => emptyDraftByKind('appointment');

type VetCareAppProps = {
  initialSection?: 'agenda' | 'tutores' | 'pets' | 'prontuarios' | 'veterinarios';
};

const VetCareApp: React.FC<VetCareAppProps> = ({ initialSection = 'agenda' }) => {
  const router = useRouter();
  const { currentVet, login, logout, pets, addPet, updatePet, deletePet, appointments, addAppointment, updateAppointment, deleteAppointment, updateAppointmentStatus, consultations, addConsultation, updateConsultation, deleteConsultation } = useVet();
  const { getDraft, salvarProgresso, limparRascunho, temRascunho } = useDraft();
  const dispatch = useDispatch();
  const skipDraftSaveRef = useRef<Record<DraftKind, boolean>>({
    appointment: false,
    tutor: false,
    pet: false,
    consultation: false,
  });

  const [screen, setScreen] = useState<'login' | 'register' | 'forgot' | 'dashboard'>('login');
  const [activeSection, setActiveSection] = useState<string>(initialSection);
  const [isModalOpen, setIsModalOpen] = useState<string | null>(null);
  const [apiTutors, setApiTutors] = useState<Tutor[]>([]);
  useEffect(() => {
    const carregarTutores = async () => {
      if (!currentVet) {
        setApiTutors([]);
        return;
      }

      try {
        const lista = await listarTutores();
        setApiTutors(lista);
      } catch {
        setApiTutors([]);
        showToast('Nao foi possivel carregar os tutores.');
      }
    };

    carregarTutores();
  }, [currentVet]);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [editingConsultationId, setEditingConsultationId] = useState<string | null>(null);
  const [editingPetId, setEditingPetId] = useState<string | null>(null);
  const [editingTutorId, setEditingTutorId] = useState<string | null>(null);
  const [hasUnread, setHasUnread] = useState(false);
  const [toast, setToast] = useState<{ message: string; show: boolean }>({ message: '', show: false });
  const [showPassword, setShowPassword] = useState(false);
  
  // Agenda filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'agendado' | 'concluido' | 'cancelado'>('all');
  const [agendaView, setAgendaView] = useState<'list' | 'calendar'>('list');
  const [appointmentDetailsModal, setAppointmentDetailsModal] = useState<string | null>(null);
  const [deleteConfirmModal, setDeleteConfirmModal] = useState<{ show: boolean; type: string; id: string; name: string }>({ show: false, type: '', id: '', name: '' });
  
  // Other searches
  const [tutorSearch, setTutorSearch] = useState('');
  const [petSearch, setPetSearch] = useState('');
  const [prontuarioSearch, setProntuarioSearch] = useState('');
  const [prescriptionSentModal, setPrescriptionSentModal] = useState(false);
  const [notifications, setNotifications] = useState<Array<{ id: string; message: string; type: 'cadastro' | 'edicao' | 'cancelamento' }>>([]);

  // Login Form
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState({ name: '', crmv: '', email: '', password: '', phone: '' });
  const [forgotForm, setForgotForm] = useState({ email: '' });
  const [forgotSuccess, setForgotSuccess] = useState(false);
  const [tutorForm, setTutorForm] = useState({
    name: '',
    email: '',
    phone: '',
    cpf: '',
    cep: '',
    street: '',
    district: '',
    city: '',
    state: '',
  });
  const [isCepLoading, setIsCepLoading] = useState(false);
  const [tutorPhoto, setTutorPhoto] = useState<string>('');
  const [petPhoto, setPetPhoto] = useState<string>('');
  const [appointmentForm, setAppointmentForm] = useState<AppointmentDraft>(emptyAppointmentForm());
  const [petForm, setPetForm] = useState<PetDraft>(() => emptyDraftByKind('pet'));
  const [consultationForm, setConsultationForm] = useState<ConsultationDraft>(() => emptyDraftByKind('consultation'));

  useEffect(() => {
    setActiveSection(initialSection);
  }, [initialSection]);

  const showToast = (message: string) => {
    setToast({ message, show: true });
    setTimeout(() => setToast({ message: '', show: false }), 3000);
  };

  const formatPhone = (value: string) => {
    const digits = value.replace(/\D/g, '');
    if (digits.length <= 2) return `(${digits}`;
    if (digits.length <= 6) return `(${digits.slice(0, 2)})${digits.slice(2)}`;
    if (digits.length <= 10) return `(${digits.slice(0, 2)})${digits.slice(2, 6)}-${digits.slice(6)}`;
    return `(${digits.slice(0, 2)})${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
  };

  const formatCpf = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 11);
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
    if (digits.length <= 9) return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
    return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
  };

  const formatCep = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 8);
    if (digits.length <= 5) return digits;
    return `${digits.slice(0, 5)}-${digits.slice(5)}`;
  };

  const onlyDigits = (value: string) => value.replace(/\D/g, '');

  const isCpfValido = (value: string) => {
    const cpf = onlyDigits(value);
    if (cpf.length !== 11) return false;
    if (/^(\d)\1{10}$/.test(cpf)) return false;

    let soma = 0;
    for (let i = 0; i < 9; i += 1) {
      soma += Number(cpf[i]) * (10 - i);
    }
    let resto = (soma * 10) % 11;
    if (resto === 10) resto = 0;
    if (resto !== Number(cpf[9])) return false;

    soma = 0;
    for (let i = 0; i < 10; i += 1) {
      soma += Number(cpf[i]) * (11 - i);
    }
    resto = (soma * 10) % 11;
    if (resto === 10) resto = 0;

    return resto === Number(cpf[10]);
  };

  const parseEndereco = (endereco: string) => {
    if (!endereco) {
      return { street: '', district: '', city: '', state: '' };
    }

    const partes = endereco.split(' - ');
    const cidadeUf = partes[2] ?? '';
    const [city, state] = cidadeUf.split('/');

    return {
      street: partes[0] ?? '',
      district: partes[1] ?? '',
      city: city ?? '',
      state: state ?? '',
    };
  };

  const buildEndereco = () => {
    const street = tutorForm.street.trim();
    const district = tutorForm.district.trim();
    const city = tutorForm.city.trim();
    const state = tutorForm.state.trim();

    const base = [street, district, `${city}${state ? `/${state}` : ''}`]
      .map((item) => item.trim())
      .filter((item) => item.length > 0);

    return base.join(' - ');
  };

  const preencherEnderecoPorCep = async (cepValue: string) => {
    const cepNormalizado = onlyDigits(cepValue);
    if (cepNormalizado.length !== 8) {
      return;
    }

    setIsCepLoading(true);
    try {
      const endereco = await buscarEnderecoPorCep(cepNormalizado);
      setTutorForm((prev) => ({
        ...prev,
        cep: formatCep(cepNormalizado),
        street: endereco.logradouro ?? '',
        district: endereco.bairro ?? '',
        city: endereco.localidade ?? '',
        state: endereco.uf ?? '',
      }));
    } catch (error) {
      console.error('Nao foi possivel consultar o CEP informado.', error);
      showToast('Nao foi possivel consultar o CEP informado.');
    } finally {
      setIsCepLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const loginResult = await loginService({
        email: loginForm.email,
        senha: loginForm.password,
      });

      if (!loginResult?.token) {
        showToast('Email ou senha incorretos');
        return;
      }

      dispatch(setToken({ token: loginResult.token }));

      let veterinarioPerfil: VeterinarioApi | null = null;
      try {
        const resposta = await api.get<VeterinarioApi[]>('/veterinarios');
        veterinarioPerfil =
          resposta.data.find(
            (v) => v.email.toLowerCase() === loginForm.email.toLowerCase(),
          ) ?? null;
      } catch {
        veterinarioPerfil = null;
      }

      const usuario = {
        id: veterinarioPerfil?.id ?? null,
        nome: veterinarioPerfil?.nome || loginForm.email,
        email: loginForm.email,
        status: 'ATIVO',
        senha: '',
        crmv: veterinarioPerfil?.crmv || 'Nao informado',
        telefone: veterinarioPerfil?.telefone || '',
      };
      dispatch(setUsuario({ usuario }));

      const vet: Veterinarian = {
        id: String(veterinarioPerfil?.id ?? loginForm.email),
        name: veterinarioPerfil?.nome || loginForm.email,
        email: loginForm.email,
        crmv: veterinarioPerfil?.crmv || 'Nao informado',
        phone: veterinarioPerfil?.telefone || '',
      };

      login(vet);
      setScreen('dashboard');
      setLoginForm({ email: '', password: '' });
      showToast('Login realizado com sucesso!');
      router.push('/home');
    } catch (error: any) {
      const mensagem =
        error?.response?.data && typeof error.response.data === 'string'
          ? error.response.data
          : 'Email ou senha incorretos';

      showToast(mensagem);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!registerForm.name.trim() || !registerForm.crmv.trim() || !registerForm.email.trim() || !registerForm.password.trim()) {
      showToast('Preencha nome, CRMV, email e senha para cadastrar.');
      return;
    }

    try {
      await api.post('/veterinarios/cadastro', {
        nome: registerForm.name.trim(),
        crmv: registerForm.crmv.trim(),
        especialidade: 'Clinico geral',
        telefone: registerForm.phone.trim(),
        email: registerForm.email.trim(),
        senha: registerForm.password,
      });

      showToast('Cadastro realizado! Faca login para continuar');
      setScreen('login');
      setLoginForm({ email: registerForm.email.trim(), password: '' });
      setRegisterForm({ name: '', crmv: '', email: '', password: '', phone: '' });
    } catch (error: any) {
      const status = error?.response?.status;
      const data = error?.response?.data;

      if (status === 409) {
        showToast(typeof data === 'string' ? data : 'Ja existe veterinario com este email ou CRMV.');
        return;
      }

      const mensagem =
        typeof data === 'string' && data.trim().length > 0
          ? data
          : 'Nao foi possivel concluir o cadastro.';

      showToast(mensagem);
    }
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setForgotSuccess(true);
    showToast('Email de recuperacao enviado!');
    setTimeout(() => {
      setScreen('login');
      setForgotSuccess(false);
      setForgotForm({ email: '' });
    }, 3000);
  };

  const handleLogout = () => {
    logout();
    setScreen('login');
    showToast('Desconectado com sucesso');
  };

  // Modal Functions
  const openModal = (type: DraftKind, editId?: string | null) => {
    const id = editId ?? null;

    if (type === 'tutor') {
      setEditingTutorId(id);
      if (temRascunho('tutor', id)) {
        const d = getDraft('tutor', id);
        if (d) setTutorForm({ name: d.name, email: d.email, phone: d.phone, cpf: d.cpf, cep: d.cep, street: '', district: '', city: '', state: '' });
      } else if (id) {
        const tutor = currentVetTutors.find((t) => t.id === id);
        setTutorForm(
          tutor
            ? { name: tutor.name, email: tutor.email, phone: tutor.phone, cpf: tutor.cpf ?? '', cep: tutor.cep ?? '', ...parseEndereco(tutor.endereco ?? '') }
            : { name: '', email: '', phone: '', cpf: '', cep: '', street: '', district: '', city: '', state: '' }
        );
        setTutorPhoto(tutor?.photo ?? '');
      } else {
        setTutorForm({ name: '', email: '', phone: '', cpf: '', cep: '', street: '', district: '', city: '', state: '' });
        setTutorPhoto('');
      }
    } else if (type === 'pet') {
      setEditingPetId(id);
      if (temRascunho('pet', id)) {
        const d = getDraft('pet', id);
        if (d) setPetForm(d);
      } else if (id) {
        const p = currentVetPets.find((x) => x.id === id);
        setPetForm(
          p
            ? {
                tutorId: p.tutorId,
                name: p.name,
                species: p.species,
                breed: p.breed ?? '',
                age: p.age !== undefined && p.age !== null ? String(p.age) : '',
                weight: p.weight !== undefined && p.weight !== null ? String(p.weight) : '',
                sex: p.sex ?? '',
                color: p.color ?? '',
              }
            : emptyDraftByKind('pet')
        );
        setPetPhoto(p?.photo ?? '');
      } else {
        setPetForm(emptyDraftByKind('pet'));
        setPetPhoto('');
      }
    } else if (type === 'consultation') {
      setEditingConsultationId(id);
      if (temRascunho('consultation', id)) {
        const d = getDraft('consultation', id);
        if (d) setConsultationForm(d);
      } else if (id) {
        const c = currentVetConsultations.find((x) => x.id === id);
        setConsultationForm(
          c
            ? {
                petId: c.petId,
                date: c.date,
                time: c.time,
                reason: c.reason,
                diagnosis: c.diagnosis,
                prescription: c.prescription,
                notes: c.notes,
              }
            : emptyDraftByKind('consultation')
        );
      } else {
        setConsultationForm(emptyDraftByKind('consultation'));
      }
    } else if (type === 'appointment') {
      if (temRascunho('appointment', null)) {
        const d = getDraft('appointment', null);
        if (d) {
          setAppointmentForm({
            petId: d.petId ?? '',
            date: d.date ?? '',
            time: d.time ?? '',
            reason: d.reason ?? '',
          });
        }
      } else {
        setAppointmentForm(emptyAppointmentForm());
      }
    }

    setIsModalOpen(type);
  };

  const closeModal = () => {
    const kind = isModalOpen as DraftKind | null;
    const tutorDraftId = editingTutorId;
    const petDraftId = editingPetId;
    const consultationDraftId = editingConsultationId;

    if (kind === 'appointment' && !skipDraftSaveRef.current.appointment) {
      const hasAny = Object.values(appointmentForm).some((v) => typeof v === 'string' && v.length > 0);
      if (hasAny) salvarProgresso('appointment', appointmentForm, null);
    } else if (kind === 'tutor' && !skipDraftSaveRef.current.tutor) {
      const hasAny = Object.values(tutorForm).some((v) => typeof v === 'string' && v.length > 0);
      if (hasAny) salvarProgresso('tutor', tutorForm, tutorDraftId);
    } else if (kind === 'pet' && !skipDraftSaveRef.current.pet) {
      const hasAny = Object.values(petForm).some((v) => typeof v === 'string' && v.length > 0);
      if (hasAny) salvarProgresso('pet', petForm, petDraftId);
    } else if (kind === 'consultation' && !skipDraftSaveRef.current.consultation) {
      const hasAny = Object.values(consultationForm).some((v) => typeof v === 'string' && v.length > 0);
      if (hasAny) salvarProgresso('consultation', consultationForm, consultationDraftId);
    }

    skipDraftSaveRef.current = {
      appointment: false,
      tutor: false,
      pet: false,
      consultation: false,
    };
    setIsModalOpen(null);
    setEditingConsultationId(null);
    setEditingPetId(null);
    setEditingTutorId(null);
    setTutorPhoto('');
    setPetPhoto('');
  };

  // Form Handlers
  const handleAddTutor = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    skipDraftSaveRef.current.tutor = true;
    limparRascunho('tutor', editingTutorId ?? null);
    const cpfNormalizado = onlyDigits(tutorForm.cpf);
    const cepNormalizado = onlyDigits(tutorForm.cep);
    const cepValido = cepNormalizado.length === 8;

    if (!isCpfValido(cpfNormalizado)) {
      showToast('CPF invalido. Informe um CPF valido com 11 digitos.');
      return;
    }

    if (!cepValido) {
      showToast('CEP invalido. Informe um CEP valido com 8 digitos.');
      return;
    }

    if (!tutorForm.street.trim() || !tutorForm.district.trim() || !tutorForm.city.trim() || !tutorForm.state.trim()) {
      showToast('Busque um CEP valido para preencher o endereco do tutor.');
      return;
    }

    const endereco = buildEndereco();

    try {
      if (editingTutorId) {
        const tutorAtualizado = await atualizarTutor(Number(editingTutorId), {
          nome: tutorForm.name,
          email: tutorForm.email,
          telefone: tutorForm.phone,
          cpf: cpfNormalizado,
          cep: cepNormalizado,
          endereco,
          status: 'ATIVO',
        });
        setApiTutors((prev) => prev.map((item) => (item.id === editingTutorId ? tutorAtualizado : item)));
        setNotifications([...notifications, { id: Date.now().toString(), message: `Tutor "${tutorForm.name}" atualizado com sucesso`, type: 'edicao' }]);
        setHasUnread(true);
        showToast('Tutor atualizado com sucesso!');
      } else {
        const tutorCriado = await criarTutor({
          nome: tutorForm.name,
          email: tutorForm.email,
          telefone: tutorForm.phone,
          cpf: cpfNormalizado,
          cep: cepNormalizado,
          endereco,
          status: 'ATIVO',
        });
        setApiTutors((prev) => [...prev, tutorCriado]);
        setNotifications([...notifications, { id: Date.now().toString(), message: `Tutor "${tutorForm.name}" cadastrado com sucesso`, type: 'cadastro' }]);
        setHasUnread(true);
        showToast('Tutor cadastrado com sucesso!');
      }
    } catch {
      showToast('Nao foi possivel salvar o tutor.');
      return;
    }

    closeModal();
    setEditingTutorId(null);
    setTutorForm({ name: '', email: '', phone: '', cpf: '', cep: '', street: '', district: '', city: '', state: '' });
    setTutorPhoto('');
  };

  const handleAddPet = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    skipDraftSaveRef.current.pet = true;
    limparRascunho('pet', editingPetId ?? null);
    const petData: Pet = {
      id: editingPetId || Date.now().toString(),
      vetId: currentVet?.id || '',
      tutorId: petForm.tutorId,
      name: petForm.name,
      species: petForm.species,
      breed: petForm.breed,
      age: petForm.age ? parseInt(petForm.age, 10) : undefined,
      weight: petForm.weight ? parseFloat(petForm.weight) : undefined,
      sex: petForm.sex,
      color: petForm.color,
      photo: petPhoto || undefined,
      createdAt: new Date(),
    };

    if (!petData.sex || !petData.color) {
      showToast('Preencha sexo e cor do pet.');
      return;
    }
    try {
      if (editingPetId) {
        await updatePet(editingPetId, petData);
        setNotifications([...notifications, { id: Date.now().toString(), message: `Pet "${petData.name}" atualizado com sucesso`, type: 'edicao' }]);
      } else {
        await addPet(petData);
        setNotifications([...notifications, { id: Date.now().toString(), message: `Pet "${petData.name}" cadastrado com sucesso`, type: 'cadastro' }]);
      }
    } catch {
      showToast('Nao foi possivel salvar o pet.');
      return;
    }

    setHasUnread(true);
    showToast(editingPetId ? 'Pet atualizado com sucesso!' : 'Pet cadastrado com sucesso!');
    setPetForm(emptyDraftByKind('pet'));
    setPetPhoto('');
    closeModal();
    setEditingPetId(null);
  };

  const handleAddAppointment = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    skipDraftSaveRef.current.appointment = true;
    const newAppointment: Appointment = {
      id: Date.now().toString(),
      vetId: currentVet?.id || '',
      petId: appointmentForm.petId,
      date: appointmentForm.date,
      time: appointmentForm.time,
      reason: appointmentForm.reason,
      status: 'agendado',
      confirmed: false,
      createdAt: new Date(),
    };
    addAppointment(newAppointment);
    setNotifications([...notifications, { id: Date.now().toString(), message: `Consulta agendada para ${newAppointment.date}`, type: 'cadastro' }]);
    setHasUnread(true);
    showToast('Consulta agendada com sucesso!');
    limparRascunho('appointment', null);
    setAppointmentForm(emptyAppointmentForm());
    closeModal();
  };

  const handleAddConsultation = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    skipDraftSaveRef.current.consultation = true;
    limparRascunho('consultation', editingConsultationId ?? null);

    if (editingConsultationId) {
      updateConsultation(editingConsultationId, {
        petId: consultationForm.petId,
        date: consultationForm.date,
        time: consultationForm.time,
        reason: consultationForm.reason,
        diagnosis: consultationForm.diagnosis,
        prescription: consultationForm.prescription,
        notes: consultationForm.notes,
      });
      setNotifications([...notifications, { id: Date.now().toString(), message: `Consulta atualizada com sucesso`, type: 'edicao' }]);
      setHasUnread(true);
      showToast('Consulta atualizada com sucesso!');
    } else {
      const newConsultation: Consultation = {
        id: Date.now().toString(),
        vetId: currentVet?.id || '',
        petId: consultationForm.petId,
        date: consultationForm.date,
        time: consultationForm.time,
        reason: consultationForm.reason,
        diagnosis: consultationForm.diagnosis,
        prescription: consultationForm.prescription,
        notes: consultationForm.notes,
        createdAt: new Date(),
      };
      addConsultation(newConsultation);
      setNotifications([...notifications, { id: Date.now().toString(), message: `Consulta registrada com sucesso`, type: 'cadastro' }]);
      setHasUnread(true);
      showToast('Consulta registrada com sucesso!');
      setPrescriptionSentModal(true);
    }
    setConsultationForm(emptyDraftByKind('consultation'));
    closeModal();
  };

  // Delete handlers with notifications
  const showDeleteConfirm = (type: string, id: string, name: string) => {
    setDeleteConfirmModal({ show: true, type, id, name });
  };

  const confirmDelete = async () => {
    const { type, id } = deleteConfirmModal;
    switch (type) {
      case 'tutor':
        await handleDeleteTutor(id);
        break;
      case 'pet':
        await handleDeletePet(id);
        break;
      case 'appointment':
        handleDeleteAppointment(id);
        break;
      case 'consultation':
        handleDeleteConsultation(id);
        break;
    }
    setDeleteConfirmModal({ show: false, type: '', id: '', name: '' });
  };

  const handleDeleteTutor = async (id: string) => {
    const tutor = apiTutors.find(t => t.id === id);
    try {
      await excluirTutor(Number(id));
      setApiTutors((prev) => prev.filter((item) => item.id !== id));
    } catch {
      showToast('Nao foi possivel remover o tutor.');
      return;
    }

    if (tutor) {
      setNotifications([...notifications, { id: Date.now().toString(), message: `Tutor "${tutor.name}" removido`, type: 'cancelamento' }]);
      setHasUnread(true);
    }
    showToast('Tutor removido com sucesso!');
  };

  const handleDeletePet = async (id: string) => {
    const pet = pets.find(p => p.id === id);
    try {
      await deletePet(id);
    } catch {
      showToast('Nao foi possivel remover o pet.');
      return;
    }

    if (pet) {
      setNotifications([...notifications, { id: Date.now().toString(), message: `Pet "${pet.name}" removido`, type: 'cancelamento' }]);
      setHasUnread(true);
    }
    showToast('Pet removido com sucesso!');
  };

  const handleDeleteAppointment = (id: string) => {
    deleteAppointment(id);
    setNotifications([...notifications, { id: Date.now().toString(), message: `Consulta removida`, type: 'cancelamento' }]);
    setHasUnread(true);
    showToast('Consulta removida com sucesso!');
  };

  const handleDeleteConsultation = (id: string) => {
    deleteConsultation(id);
    setNotifications([...notifications, { id: Date.now().toString(), message: `Prontuário removido`, type: 'cancelamento' }]);
    setHasUnread(true);
    showToast('Prontuário removido com sucesso!');
  };

  // helper to choose icon by species
  const getSpeciesIcon = (species: string) => {
    const s = species.toLowerCase();
    if (s.includes('cao') || s.includes('cão') || s.includes('dog')) return <Dog className="w-6 h-6 text-primary/30" />;
    if (s.includes('gato') || s.includes('cat')) return <Cat className="w-6 h-6 text-primary/30" />;
    if (s.includes('ave')) return <Feather className="w-6 h-6 text-primary/30" />;
    if (s.includes('reptil')) return <Turtle className="w-6 h-6 text-primary/30" />;
    if (s.includes('roedor')) return <Mouse className="w-6 h-6 text-primary/30" />;
    return <Dog className="w-6 h-6 text-primary/30" />;
  };

  // Filter data by current vet
  const currentVetTutors = apiTutors;
  const currentVetPets = pets.filter(p => p.vetId === currentVet?.id);
  const currentVetAppointments = appointments.filter(a => a.vetId === currentVet?.id);
  const currentVetConsultations = consultations.filter(c => c.vetId === currentVet?.id);

  // if editing a pet, find its record
  const petToEdit = editingPetId ? currentVetPets.find(p => p.id === editingPetId) || null : null;
  // if editing a consultation, find its record
  const consultationToEdit = editingConsultationId ? currentVetConsultations.find(c => c.id === editingConsultationId) || null : null; 

  // Login Screen
  if (!currentVet) {
    return (
      <div className="h-full w-full flex items-center justify-center p-6 bg-gradient-to-br from-slate-50 via-blue-50 to-emerald-50 relative overflow-hidden min-h-screen">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl"></div>
        </div>

        <VetCareAuthPanel
          screen={screen}
          loginForm={loginForm}
          registerForm={registerForm}
          forgotForm={forgotForm}
          forgotSuccess={forgotSuccess}
          showPassword={showPassword}
          onLoginFormChange={(field, value) => setLoginForm((prev) => ({ ...prev, [field]: value }))}
          onRegisterFormChange={(field, value) => setRegisterForm((prev) => ({ ...prev, [field]: value }))}
          onForgotFormChange={(value) => setForgotForm({ email: value })}
          onSubmitLogin={handleLogin}
          onSubmitRegister={handleRegister}
          onSubmitForgot={handleForgotPassword}
          onGoToLogin={() => setScreen('login')}
          onGoToRegister={() => setScreen('register')}
          onGoToForgot={() => setScreen('forgot')}
          onTogglePasswordVisibility={() => setShowPassword((value) => !value)}
          formatPhone={formatPhone}
        />
      </div>
    );
  }

  // Dashboard
  return (
    <div className="h-screen w-full flex flex-col bg-background overflow-hidden">
      <VetCareDashboardHeader
        currentVet={currentVet}
        notificationsOpen={notificationsOpen}
        hasUnread={hasUnread}
        notifications={notifications}
        onToggleNotifications={() => {
          const opening = !notificationsOpen;
          setNotificationsOpen(opening);
          if (opening) setHasUnread(false);
        }}
        onClearNotifications={() => {
          setNotifications([]);
          setHasUnread(false);
          setNotificationsOpen(false);
        }}
        onLogout={handleLogout}
      />

      <div className="flex flex-1 overflow-hidden">
        <nav className="w-64 bg-white border-r border-slate-200 p-4 flex flex-col overflow-auto scrollbar-thin">
          <div className="space-y-2">
            {[
              { id: 'agenda', icon: <Calendar className="w-5 h-5" />, label: 'Agenda' },
              { id: 'tutores', icon: <Users className="w-5 h-5" />, label: 'Tutores' },
              { id: 'pets', icon: <Dog className="w-5 h-5" />, label: 'Pets' },
              { id: 'veterinarios', icon: <User className="w-5 h-5" />, label: 'Veterinários' },
              { id: 'prontuarios', icon: <ClipboardList className="w-5 h-5" />, label: 'Prontuarios' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-left transition-all font-medium ${
                  activeSection === item.id
                    ? 'bg-primary/10 text-primary'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-primary'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}
          </div>

          {/* ...existing code... */}
          <div className="mt-auto pt-6 border-t border-slate-200">
            <h3 className="text-sm font-semibold text-slate-700 mb-4">Resumo</h3>
            <div className="space-y-3">
              <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl p-4 border border-primary/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-slate-600">Consultas</p>
                    <p className="text-2xl font-bold text-primary mt-1">{currentVetConsultations.length}</p>
                  </div>
                  <Calendar className="w-8 h-8 text-primary/30" />
                </div>
              </div>
              <div className="bg-gradient-to-br from-secondary/10 to-secondary/5 rounded-xl p-4 border border-secondary/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-slate-600">Pets</p>
                    <p className="text-2xl font-bold text-secondary mt-1">{currentVetPets.length}</p>
                  </div>
                  <Dog className="w-8 h-8 text-secondary/30" />
                </div>
              </div>
            </div>
          </div>
        </nav>

        <main className="flex-1 overflow-auto p-6 bg-gradient-to-br from-slate-50 via-emerald-50 to-blue-50 scrollbar-thin">
          {activeSection === 'agenda' && (
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
              onStatusFilterChange={(value) => setStatusFilter(value)}
              onOpenAppointmentModal={() => openModal('appointment')}
              onSetAppointmentDetailsModal={setAppointmentDetailsModal}
              onDeleteAppointment={handleDeleteAppointment}
            />
          )}

          {activeSection === 'tutores' && (
            <VetCareTutorSection
              currentVetTutors={currentVetTutors}
              tutorSearch={tutorSearch}
              onTutorSearchChange={setTutorSearch}
              onOpenTutorModal={(id) => openModal('tutor', id)}
              onDeleteTutor={handleDeleteTutor}
            />
          )}

          {activeSection === 'pets' && (
            <VetCarePetSection
              currentVetPets={currentVetPets}
              currentVetTutors={currentVetTutors}
              petSearch={petSearch}
              onPetSearchChange={setPetSearch}
              onOpenPetModal={(id) => openModal('pet', id)}
              onDeletePet={handleDeletePet}
              renderSpeciesIcon={getSpeciesIcon}
            />
          )}

          {activeSection === 'prontuarios' && (
            <VetCareProntuarioSection
              currentVetConsultations={currentVetConsultations}
              currentVetPets={currentVetPets}
              prontuarioSearch={prontuarioSearch}
              onProntuarioSearchChange={setProntuarioSearch}
              onOpenConsultationModal={(id) => openModal('consultation', id)}
              onDeleteConsultation={handleDeleteConsultation}
              renderSpeciesIcon={getSpeciesIcon}
            />
          )}

          {activeSection === 'veterinarios' && <VetCareVeterinarioSection currentVet={currentVet} />}
        </main>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          {isModalOpen === 'tutor' && (
            <VetCareTutorModal
              tutorForm={tutorForm}
              tutorPhoto={tutorPhoto}
              isCepLoading={isCepLoading}
              currentVetTutors={currentVetTutors}
              editingTutorId={editingTutorId}
              onClose={closeModal}
              onSubmit={handleAddTutor}
              onTutorFormChange={setTutorForm}
              onTutorPhotoChange={setTutorPhoto}
              onTutorPhotoClear={() => setTutorPhoto('')}
              onCepBlur={preencherEnderecoPorCep}
              onDiscardDraft={() => {
                limparRascunho('tutor', editingTutorId);
                if (editingTutorId) {
                  const tutor = currentVetTutors.find((item) => item.id === editingTutorId);
                  setTutorForm(
                    tutor
                      ? { name: tutor.name, email: tutor.email, phone: tutor.phone, cpf: tutor.cpf ?? '', cep: tutor.cep ?? '', ...parseEndereco(tutor.endereco ?? '') }
                      : { name: '', email: '', phone: '', cpf: '', cep: '', street: '', district: '', city: '', state: '' }
                  );
                } else {
                  setTutorForm({ name: '', email: '', phone: '', cpf: '', cep: '', street: '', district: '', city: '', state: '' });
                }
              }}
            />
          )}

          {isModalOpen === 'pet' && (
            <VetCarePetModal
              petForm={petForm}
              petPhoto={petPhoto}
              currentVetTutors={currentVetTutors}
              editingPetId={editingPetId}
              onClose={closeModal}
              onSubmit={handleAddPet}
              onPetFormChange={setPetForm}
              onPetPhotoChange={setPetPhoto}
              onPetPhotoClear={() => setPetPhoto('')}
              onDiscardDraft={() => {
                limparRascunho('pet', editingPetId);
                if (editingPetId && petToEdit) {
                  setPetForm({
                    tutorId: petToEdit.tutorId,
                    name: petToEdit.name,
                    species: petToEdit.species,
                    breed: petToEdit.breed ?? '',
                    age: petToEdit.age !== undefined && petToEdit.age !== null ? String(petToEdit.age) : '',
                    weight: petToEdit.weight !== undefined && petToEdit.weight !== null ? String(petToEdit.weight) : '',
                    sex: petToEdit.sex ?? '',
                    color: petToEdit.color ?? '',
                  });
                } else {
                  setPetForm(emptyDraftByKind('pet'));
                }
              }}
            />
          )}

          {isModalOpen === 'appointment' && (
            <VetCareAppointmentModal
              appointmentForm={appointmentForm}
              currentVetPets={currentVetPets}
              showDraft={temRascunho('appointment', null)}
              onClose={closeModal}
              onSubmit={handleAddAppointment}
              onAppointmentFormChange={setAppointmentForm}
              onDiscardDraft={() => {
                limparRascunho('appointment', null);
                setAppointmentForm(emptyAppointmentForm());
              }}
            />
          )}

          {isModalOpen === 'consultation' && (
            <VetCareConsultationModal
              consultationForm={consultationForm}
              currentVetPets={currentVetPets}
              editingConsultationId={editingConsultationId}
              consultationToEdit={consultationToEdit}
              showDraft={temRascunho('consultation', editingConsultationId)}
              onClose={closeModal}
              onSubmit={handleAddConsultation}
              onConsultationFormChange={setConsultationForm}
              onDiscardDraft={() => {
                limparRascunho('consultation', editingConsultationId);
                if (editingConsultationId && consultationToEdit) {
                  setConsultationForm({
                    petId: consultationToEdit.petId,
                    date: consultationToEdit.date,
                    time: consultationToEdit.time,
                    reason: consultationToEdit.reason,
                    diagnosis: consultationToEdit.diagnosis,
                    prescription: consultationToEdit.prescription,
                    notes: consultationToEdit.notes,
                  });
                } else {
                  setConsultationForm(emptyDraftByKind('consultation'));
                }
              }}
            />
          )}
        </div>
      )}

      {toast.show && (
        <div className="fixed bottom-6 right-6 z-50">
          <div className="bg-gradient-to-r from-primary to-emerald-500 text-white px-6 py-3.5 rounded-xl shadow-2xl shadow-primary/40 flex items-center gap-3 font-semibold animate-fade-in">
            <CheckCircle className="w-5 h-5" />
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      {prescriptionSentModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md border border-slate-200 shadow-2xl">
            <div className="p-6 border-b flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Mail className="w-6 h-6 text-primary" />
                <h3 className="text-2xl font-bold">Prescrição Enviada</h3>
              </div>
            </div>
            <div className="p-6 text-center space-y-4">
              <p className="text-slate-700">A prescrição foi enviada com sucesso para o email do tutor!</p>
              <p className="text-sm text-slate-500">O tutor receberá um resumo da consulta, diagnóstico e recomendações via email.</p>
              <button 
                onClick={() => setPrescriptionSentModal(false)}
                className="w-full px-4 py-3 bg-gradient-to-r from-primary to-secondary text-white font-bold rounded-xl hover:shadow-lg transition-all"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      {appointmentDetailsModal && (() => {
        const appointment = currentVetAppointments.find(a => a.id === appointmentDetailsModal);
        const pet = appointment ? currentVetPets.find(p => p.id === appointment.petId) : null;
        const tutor = pet ? currentVetTutors.find(t => t.id === pet.tutorId) : null;

        if (!appointment || !pet || !tutor) return null;

        const handleWhatsAppMessage = () => {
          const message = `Olá ${tutor.name}! Lembrando da consulta do ${pet.name} agendada para ${appointment.date} às ${appointment.time}. Motivo: ${appointment.reason}. ${appointment.confirmed ? 'Consulta confirmada!' : 'Aguardando confirmação.'}`;
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
                    <label className="block text-sm font-semibold text-slate-600 mb-1">Horário</label>
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
                  <label className="block text-sm font-semibold text-slate-600 mb-1">Descrição</label>
                  <p className="text-slate-700">{appointment.reason}</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-600 mb-1">Status</label>
                  <div className="flex items-center gap-3">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      appointment.confirmed ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {appointment.confirmed ? 'Confirmado' : 'Pendente Confirmação'}
                    </span>
                    <button
                      onClick={() => {
                        updateAppointment(appointment.id, { confirmed: !appointment.confirmed });
                        showToast(`Consulta ${!appointment.confirmed ? 'confirmada' : 'marcada como pendente'}!`);
                      }}
                      className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                        appointment.confirmed 
                          ? 'bg-yellow-500 hover:bg-yellow-600 text-white' 
                          : 'bg-green-500 hover:bg-green-600 text-white'
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
    </div>
  );
};

export default VetCareApp;