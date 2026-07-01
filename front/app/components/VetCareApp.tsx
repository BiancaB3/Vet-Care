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

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Cadastro realizado! Faca login para continuar');
    setScreen('login');
    setRegisterForm({ name: '', crmv: '', email: '', password: '', phone: '' });
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

        <div className="w-full max-w-md animate-fade-in relative z-10">
          <div className="text-center mb-10">
            <div className="flex justify-center mb-6">
              <img src="/LOGOVETCARE.png" alt="VetCare" className="w-24 h-24 object-cover rounded-full animate-float animate-pulse-glow mix-blend-multiply" />
            </div>
            <h1 className="text-4xl font-bold mb-2 text-primary">VetCare</h1>
            <p className="text-lg text-primary">Sistema de Gestao Veterinaria</p>
          </div>

          <div className="modern-card rounded-3xl p-8 shadow-2xl">
            {screen === 'login' && (
              <form onSubmit={handleLogin} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-3">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="email"
                      value={loginForm.email}
                      onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                      placeholder="seu@email.com"
                      className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:border-primary font-medium"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-3">Senha</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      key={showPassword ? 'text' : 'password'}
                      type={showPassword ? 'text' : 'password'}
                      value={loginForm.password}
                      onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                      placeholder="••••••••"
                      className="w-full pl-12 pr-12 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:border-primary font-medium"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full py-3.5 bg-gradient-to-r from-primary to-secondary hover:shadow-lg hover:shadow-primary/40 text-white font-bold rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg"
                >
                  Entrar
                </button>
                <p className="text-center text-sm text-slate-600">
                  Nao tem conta?{' '}
                  <button
                    type="button"
                    onClick={() => setScreen('register')}
                    className="text-emerald-600 hover:text-emerald-700 font-bold"
                  >
                    Cadastre-se
                  </button>
                </p>
                <p className="text-center text-sm text-slate-600 mt-2">
                  <button
                    type="button"
                    onClick={() => setScreen('forgot')}
                    className="text-primary hover:text-secondary font-bold"
                  >
                    Esqueci minha senha
                  </button>
                </p>
              </form>
            )}

            {screen === 'register' && (
              <form onSubmit={handleRegister} className="space-y-4">
                <h3 className="text-xl font-bold text-slate-800 mb-4">Criar Conta</h3>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Nome Completo</label>
                  <input
                    type="text"
                    value={registerForm.name}
                    onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })}
                    placeholder="Dr(a). Nome"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:border-primary font-medium"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">CRMV</label>
                  <input
                    type="text"
                    value={registerForm.crmv}
                    onChange={(e) => setRegisterForm({ ...registerForm, crmv: e.target.value })}
                    placeholder="CRMV-XX/12345"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:border-primary font-medium"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email</label>
                  <input
                    type="email"
                    value={registerForm.email}
                    onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                    placeholder="seu@email.com"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:border-primary font-medium"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Senha</label>
                  <input
                    type="password"
                    value={registerForm.password}
                    onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                    placeholder="••••••••"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:border-primary font-medium"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Telefone</label>
                  <input
                    type="tel"
                    value={registerForm.phone}
                    onChange={(e) => setRegisterForm({ ...registerForm, phone: formatPhone(e.target.value) })}
                    placeholder="(11) 99999-9999"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:border-primary font-medium"
                    required
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setScreen('login')}
                    className="flex-1 px-4 py-2.5 border-2 border-slate-300 text-slate-700 font-bold rounded-xl hover:bg-slate-100 transition-all"
                  >
                    Voltar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2.5 bg-gradient-to-r from-primary to-secondary hover:shadow-lg text-white font-bold rounded-xl transition-all"
                  >
                    Cadastrar
                  </button>
                </div>
              </form>
            )}

            {screen === 'forgot' && !forgotSuccess && (
              <form onSubmit={handleForgotPassword} className="space-y-5">
                <h3 className="text-xl font-bold text-slate-900 mb-4">Recuperar Senha</h3>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-3">Email Cadastrado</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="email"
                      value={forgotForm.email}
                      onChange={(e) => setForgotForm({ email: e.target.value })}
                      placeholder="seu@email.com"
                      className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:border-primary font-medium"
                      required
                    />
                  </div>
                </div>
                <p className="text-sm text-slate-600 text-center">Voce receberah instrucoes de recuperacao de senha no seu email cadastrado.</p>
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setScreen('login')}
                    className="flex-1 px-4 py-3.5 border-2 border-slate-300 text-slate-700 font-bold rounded-xl hover:bg-slate-100 transition-all"
                  >
                    Voltar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-3.5 bg-gradient-to-r from-primary to-secondary hover:shadow-lg text-white font-bold rounded-xl transition-all shadow-lg"
                  >
                    Enviar
                  </button>
                </div>
              </form>
            )}

            {screen === 'forgot' && forgotSuccess && (
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Email Enviado!</h3>
                <p className="text-sm text-slate-600">Verifique sua caixa de entrada e siga as instrucoes para recuperar sua senha.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Dashboard
  return (
    <div className="h-screen w-full flex flex-col bg-background overflow-hidden">
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-40 backdrop-blur-sm shadow-sm">
        <div className="flex items-center gap-4">
          <img src="/LOGOVETCARE.png" alt="VetCare" className="w-12 h-12 object-cover rounded-full mix-blend-multiply" />
          <div>
            <h1 className="text-2xl font-bold text-primary">VetCare</h1>
            <p className="text-xs text-primary font-bold">Dashboard Profissional</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {/* bell moved to left of profile */}
          <div className="relative">
            <button
              onClick={() => {
                const opening = !notificationsOpen;
                setNotificationsOpen(opening);
                if (opening) setHasUnread(false);
              }}
              className="relative p-2 hover:bg-primary/10 text-slate-600 hover:text-primary rounded-xl transition-all"
            >
              <Bell className="w-5 h-5" />
              {hasUnread && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
              )}
            </button>
            {/* dropdown always renders when open, even if empty */}
            {notificationsOpen && (
              <div className="absolute right-0 top-12 bg-white border border-slate-200 rounded-xl shadow-xl p-4 w-64 max-h-96 overflow-y-auto z-50">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Bell className="w-5 h-5 text-primary" />
                    <h4 className="text-sm font-semibold text-slate-700">Notificações</h4>
                  </div>
                  <button onClick={() => { setNotifications([]); setHasUnread(false); setNotificationsOpen(false); }} className="p-1 hover:bg-slate-100 rounded-full">
                    <X className="w-4 h-4 text-slate-400" />
                  </button>
                </div>
                {notifications.length === 0 ? (
                  <p className="text-xs text-slate-500">Nenhuma notificação</p>
                ) : (
                  <div className="space-y-2">
                    {notifications.slice(-10).reverse().map((notif) => (
                      <div key={notif.id} className="bg-sage-50 text-xs text-slate-600 pb-2 border-b border-slate-200 last:border-0 rounded px-2 py-1">
                        <p className="line-clamp-2">{notif.message}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center shadow-lg">
              <User className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">{currentVet.name}</p>
              <p className="text-xs text-slate-500">{currentVet.crmv}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="p-2 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-xl transition-all"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </header>

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
            <section>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-3xl font-bold text-primary">Agenda de Consultas</h2>
                  <p className="text-slate-500 mt-2">Consultas agendadas</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex bg-slate-100 rounded-lg p-1">
                    <button
                      onClick={() => setAgendaView('list')}
                      className={`px-4 py-2 rounded-md font-medium transition-all ${agendaView === 'list' ? 'bg-white text-primary shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
                    >
                      Lista
                    </button>
                    <button
                      onClick={() => setAgendaView('calendar')}
                      className={`px-4 py-2 rounded-md font-medium transition-all ${agendaView === 'calendar' ? 'bg-white text-primary shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
                    >
                      Calendário
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => openModal('appointment')}
                    className="flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-primary to-secondary hover:shadow-xl hover:shadow-primary/40 text-white font-bold rounded-xl transition-all shadow-lg"
                  >
                    <Calendar className="w-5 h-5" /> Nova Consulta
                  </button>
                </div>
              </div>

              {/* busca e filtro */}
              <div className="flex gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Buscar consulta..."
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:border-primary font-medium"
                  />
                </div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:border-primary font-medium"
                >
                  <option value="all">Todos</option>
                  <option value="agendado">Agendado</option>
                  <option value="concluido">Concluído</option>
                  <option value="cancelado">Cancelado</option>
                </select>
              </div>

              {agendaView === 'list' ? (
                // List View
                (() => {
                  const filtered = currentVetAppointments.filter((apt) => {
                    const pet = currentVetPets.find(p => p.id === apt.petId);
                    if (searchQuery) {
                      const name = pet?.name.toLowerCase() || '';
                      if (!name.includes(searchQuery.toLowerCase())) return false;
                    }
                    if (statusFilter !== 'all' && apt.status !== statusFilter) return false;
                    return true;
                  });

                  if (filtered.length === 0) {
                    return (
                      <div className="text-center py-12">
                        <CalendarX className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                        <p className="text-slate-400">Nenhuma consulta agendada</p>
                      </div>
                    );
                  }

                  return (
                    <div className="space-y-4">
                      {filtered.map((apt) => {
                        const pet = currentVetPets.find(p => p.id === apt.petId);
                        const tutor = currentVetTutors.find(t => t.id === pet?.tutorId);
                        return (
                          <div key={apt.id} className="modern-card rounded-xl p-4 border border-slate-200 cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setAppointmentDetailsModal(apt.id)}>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                <Calendar className="w-6 h-6 text-primary" />
                                <div>
                                  <h4 className="font-semibold text-text">{pet?.name || 'Pet'}</h4>
                                  <p className="text-xs text-slate-500">{apt.date} - {apt.time}</p>
                                  <p className="text-xs text-slate-400">{apt.reason}</p>
                                  <div className="flex items-center gap-2 mt-1">
                                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                      apt.confirmed ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                    }`}>
                                      {apt.confirmed ? 'Confirmado' : 'Pendente'}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <button onClick={(e) => { e.stopPropagation(); handleDeleteAppointment(apt.id); }} className="p-2 hover:bg-red-50 rounded-lg">
                                <Trash2 className="w-4 h-4 text-slate-400 hover:text-red-500" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })()
              ) : (
                // Calendar View
                <div className="bg-white rounded-xl border border-slate-200 p-6">
                  <CalendarView appointments={currentVetAppointments} pets={currentVetPets} onDeleteAppointment={handleDeleteAppointment} />
                </div>
              )}
            </section>
          )}

          {activeSection === 'tutores' && (
            <section>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-3xl font-bold text-primary">Cadastro de Tutores</h2>
                  <p className="text-slate-400 mt-2">Gerenciar tutores e contatos</p>
                </div>
                <button
                  type="button"
                  onClick={() => openModal('tutor')}
                  className="flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-primary to-secondary hover:shadow-xl text-white font-bold rounded-xl transition-all shadow-lg"
                >
                  <UserPlus className="w-5 h-5" /> Novo Tutor
                </button>
              </div>

              {/* busca de tutores */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  value={tutorSearch}
                  onChange={(e) => setTutorSearch(e.target.value)}
                  placeholder="Buscar tutor..."
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:border-primary font-medium"
                />
              </div>

              {currentVetTutors.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                  <p className="text-slate-400">Nenhum tutor cadastrado</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {currentVetTutors
                    .filter(t => t.name.toLowerCase().includes(tutorSearch.toLowerCase()))
                    .map((tutor) => (
                      <div key={tutor.id} className="modern-card rounded-xl p-4 border border-slate-200">
                        <div className="flex items-start justify-between mb-3">
                          {tutor.photo
                            ? <img src={tutor.photo} alt={tutor.name} className="w-8 h-8 rounded-full object-cover" />
                            : <User className="w-6 h-6 text-primary" />
                          }
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => openModal('tutor', tutor.id)}
                              className="p-1 hover:bg-blue-50 rounded"
                            >
                              <Edit2 className="w-4 h-4 text-slate-400 hover:text-blue-500" />
                            </button>
                            <button onClick={() => handleDeleteTutor(tutor.id)} className="p-1 hover:bg-red-50 rounded">
                              <Trash2 className="w-4 h-4 text-slate-400 hover:text-red-500" />
                            </button>
                          </div>
                        </div>
                        <h4 className="font-semibold mb-1">{tutor.name}</h4>
                        <p className="text-xs text-slate-500">{tutor.email}</p>
                        <p className="text-xs text-slate-500">{tutor.phone}</p>
                      </div>
                    ))}
                </div>
              )}
            </section>
          )}

          {activeSection === 'pets' && (
            <section>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-3xl font-bold text-primary">Cadastro de Pets</h2>
                  <p className="text-slate-400 mt-2">Pets cadastrados</p>
                </div>
                <button
                  type="button"
                  onClick={() => openModal('pet')}
                  className="flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-primary to-secondary hover:shadow-xl text-white font-bold rounded-xl transition-all shadow-lg"
                >
                  <Dog className="w-5 h-5" /> Novo Pet
                </button>
              </div>

              {/* busca de pets */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  value={petSearch}
                  onChange={(e) => setPetSearch(e.target.value)}
                  placeholder="Buscar pet..."
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:border-primary font-medium"
                />
              </div>

              {currentVetPets.length === 0 ? (
                <div className="text-center py-12">
                  <Dog className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                  <p className="text-slate-400">Nenhum pet cadastrado</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {currentVetPets
                    .filter(p => p.name.toLowerCase().includes(petSearch.toLowerCase()))
                    .map((pet) => {
                      const tutor = currentVetTutors.find(t => t.id === pet.tutorId);
                      return (
                        <div key={pet.id} className="modern-card rounded-xl p-4 border border-slate-200">
                          <div className="flex items-start justify-between mb-3">
                            {getSpeciesIcon(pet.species)}
                            <div className="flex gap-2">
                              <button type="button" onClick={() => openModal('pet', pet.id)} className="p-1 hover:bg-blue-50 rounded">
                                <Edit2 className="w-4 h-4 text-slate-400 hover:text-blue-500" />
                              </button>
                              <button onClick={() => handleDeletePet(pet.id)} className="p-1 hover:bg-red-50 rounded">
                                <Trash2 className="w-4 h-4 text-slate-400 hover:text-red-500" />
                              </button>
                            </div>
                          </div>
                          <h4 className="font-semibold mb-1">{pet.name}</h4>
                          <p className="text-sm text-slate-500 mb-2">{pet.species}{pet.breed ? ` - ${pet.breed}` : ''}</p>
                          {tutor && <p className="text-xs text-primary">Tutor: {tutor.name}</p>}
                        </div>
                      );
                    })}
                </div>
              )}
            </section>
          )}

          {activeSection === 'prontuarios' && (
            <section>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-3xl font-bold text-primary">Prontuarios</h2>
                  <p className="text-slate-400 mt-2">Historico de prontuários</p>
                </div>
                <button
                  type="button"
                  onClick={() => openModal('consultation')}
                  className="flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-primary to-secondary hover:shadow-xl text-white font-bold rounded-xl transition-all shadow-lg"
                >
                  <FilePlus className="w-5 h-5" /> Novo Prontuário
                </button>
              </div>

              {/* busca de prontuários */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  value={prontuarioSearch}
                  onChange={(e) => setProntuarioSearch(e.target.value)}
                  placeholder="Buscar prontuário..."
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:border-primary font-medium"
                />
              </div>

              {currentVetConsultations.length === 0 ? (
                <div className="text-center py-12">
                  <ClipboardList className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                  <p className="text-slate-400">Nenhuma consulta registrada</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {currentVetConsultations
                    .filter(c => {
                      const pet = currentVetPets.find(p => p.id === c.petId);
                      return (pet?.name.toLowerCase() || '').includes(prontuarioSearch.toLowerCase());
                    })
                    .map((cons) => {
                      const pet = currentVetPets.find(p => p.id === cons.petId);
                      return (
                        <div key={cons.id} className="modern-card rounded-xl p-4 border border-slate-200">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <div className="flex items-center gap-2">
                            {pet && getSpeciesIcon(pet.species)}
                            <h4 className="font-semibold">{pet?.name || 'Pet'}</h4>
                          </div>
                              <p className="text-xs text-slate-500">{cons.date} - {cons.time}</p>
                            </div>
                            <div className="flex gap-2">
                              <button type="button" onClick={() => openModal('consultation', cons.id)} className="p-2 hover:bg-blue-50 rounded-lg">
                                <Edit2 className="w-4 h-4 text-slate-400 hover:text-blue-500" />
                              </button>
                              <button onClick={() => handleDeleteConsultation(cons.id)} className="p-2 hover:bg-red-50 rounded-lg">
                                <Trash2 className="w-4 h-4 text-slate-400 hover:text-red-500" />
                              </button>
                            </div>
                          </div>
                          {cons.reason && <p className="text-sm mb-2"><strong>Motivo:</strong> {cons.reason}</p>}
                          {cons.diagnosis && <p className="text-sm mb-2"><strong>Diagnostico:</strong> {cons.diagnosis}</p>}
                          {cons.prescription && <p className="text-sm text-blue-600 p-2 bg-blue-50 rounded"><strong>Prescricao:</strong> {cons.prescription}</p>}
                        </div>
                      );
                    })}
                </div>
              )}
            </section>
          )}

          {activeSection === 'veterinarios' && (
            <section>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-3xl font-bold text-primary">Veterinários</h2>
                  <p className="text-slate-400 mt-2">Perfil e profissionais vinculados</p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div className="modern-card rounded-xl p-5 border border-slate-200">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Veterinário logado</p>
                  <h3 className="text-xl font-bold text-slate-900">{currentVet.name}</h3>
                  <p className="text-sm text-slate-500 mt-1">{currentVet.email}</p>
                  <p className="text-sm text-slate-600 mt-2"><strong>CRMV:</strong> {currentVet.crmv}</p>
                  <p className="text-sm text-slate-600"><strong>Telefone:</strong> {currentVet.phone || 'Não informado'}</p>
                </div>
              </div>
            </section>
          )}
        </main>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          {isModalOpen === 'tutor' && (
            <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-slate-200 shadow-2xl">
              <div className="p-6 border-b flex items-center justify-between sticky top-0 bg-white">
                <div className="flex items-center gap-3">
                  <Users className="w-6 h-6 text-primary" />
                  <h3 className="text-2xl font-bold">Cadastrar Tutor</h3>
                </div>
                <button onClick={closeModal} className="p-2 hover:bg-slate-100 rounded-lg">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleAddTutor} className="p-6 space-y-5">
                {temRascunho('tutor', editingTutorId) && (
                  <div className="p-3 bg-amber-50 text-amber-800 rounded-xl text-sm flex items-center justify-between gap-3 border border-amber-200">
                    <span>Rascunho recuperado.</span>
                    <button
                      type="button"
                      onClick={() => {
                        limparRascunho('tutor', editingTutorId);
                        if (editingTutorId) {
                          const tutor = currentVetTutors.find((t) => t.id === editingTutorId);
                          setTutorForm(
                            tutor
                              ? { name: tutor.name, email: tutor.email, phone: tutor.phone, cpf: tutor.cpf ?? '', cep: tutor.cep ?? '', ...parseEndereco(tutor.endereco ?? '') }
                              : { name: '', email: '', phone: '', cpf: '', cep: '', street: '', district: '', city: '', state: '' }
                          );
                        } else {
                          setTutorForm({ name: '', email: '', phone: '', cpf: '', cep: '', street: '', district: '', city: '', state: '' });
                        }
                      }}
                      className="shrink-0 px-3 py-1.5 font-semibold rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900"
                    >
                      Descartar
                    </button>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Foto do Tutor</label>
                  <div className="flex items-center gap-4">
                    <div className="relative w-20 h-20 rounded-full border-2 border-dashed border-slate-300 flex items-center justify-center overflow-hidden bg-slate-50 hover:border-primary transition-colors cursor-pointer"
                      onClick={() => document.getElementById('tutor-photo-input')?.click()}>
                      {tutorPhoto
                        ? <img src={tutorPhoto} alt="Foto do tutor" className="w-full h-full object-cover" />
                        : <div className="flex flex-col items-center gap-1 text-slate-400">
                            <User className="w-7 h-7" />
                            <span className="text-xs">Foto</span>
                          </div>
                      }
                    </div>
                    <div className="flex flex-col gap-2">
                      <button type="button" onClick={() => document.getElementById('tutor-photo-input')?.click()}
                        className="px-3 py-2 text-sm font-medium rounded-xl border border-primary text-primary hover:bg-primary/10 transition-all">
                        {tutorPhoto ? 'Alterar foto' : 'Enviar foto'}
                      </button>
                      {tutorPhoto && (
                        <button type="button" onClick={() => setTutorPhoto('')}
                          className="px-3 py-2 text-sm font-medium rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-100 transition-all">
                          Remover
                        </button>
                      )}
                    </div>
                    <input id="tutor-photo-input" type="file" accept="image/*" className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        const reader = new FileReader();
                        reader.onload = (ev) => setTutorPhoto(ev.target?.result as string);
                        reader.readAsDataURL(file);
                        e.target.value = '';
                      }} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Nome Completo</label>
                  <input type="text" value={tutorForm.name} onChange={(e) => setTutorForm({ ...tutorForm, name: e.target.value })} placeholder="Nome Completo" required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-primary font-medium" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Email</label>
                    <input type="email" value={tutorForm.email} onChange={(e) => setTutorForm({ ...tutorForm, email: e.target.value })} placeholder="Email" required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-primary font-medium" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Telefone</label>
                    <input type="tel" value={tutorForm.phone} onChange={(e) => setTutorForm({ ...tutorForm, phone: formatPhone(e.target.value) })} placeholder="(XX)XXXXX-XXXX" required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-primary font-medium" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">CPF</label>
                    <input type="text" value={tutorForm.cpf} onChange={(e) => setTutorForm({ ...tutorForm, cpf: formatCpf(e.target.value) })} placeholder="000.000.000-00 ou 00000000000" required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-primary font-medium" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">CEP</label>
                    <input type="text" value={tutorForm.cep} onChange={(e) => setTutorForm({ ...tutorForm, cep: formatCep(e.target.value) })} onBlur={() => void preencherEnderecoPorCep(tutorForm.cep)} placeholder="00000-000 ou 00000000" required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-primary font-medium" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Rua</label>
                    <input type="text" value={tutorForm.street} onChange={(e) => setTutorForm({ ...tutorForm, street: e.target.value })} placeholder="Rua" required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-primary font-medium" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Bairro</label>
                    <input type="text" value={tutorForm.district} onChange={(e) => setTutorForm({ ...tutorForm, district: e.target.value })} placeholder="Bairro" required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-primary font-medium" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Cidade</label>
                    <input type="text" value={tutorForm.city} onChange={(e) => setTutorForm({ ...tutorForm, city: e.target.value })} placeholder="Cidade" required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-primary font-medium" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">UF</label>
                    <input type="text" value={tutorForm.state} onChange={(e) => setTutorForm({ ...tutorForm, state: e.target.value.toUpperCase().slice(0, 2) })} placeholder="UF" required maxLength={2} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-primary font-medium uppercase" />
                  </div>
                </div>
                {isCepLoading && <p className="text-sm text-slate-500">Buscando endereco pelo CEP...</p>}
                <div className="flex gap-3 pt-4">
                  <button type="button" onClick={closeModal} className="flex-1 px-4 py-3 border-2 text-slate-700 font-bold rounded-xl hover:bg-slate-100">
                    Cancelar
                  </button>
                  <button type="submit" className="flex-1 px-4 py-3 bg-gradient-to-r from-primary to-secondary text-white font-bold rounded-xl">
                    Salvar
                  </button>
                </div>
              </form>
            </div>
          )}

          {isModalOpen === 'pet' && (
            <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-slate-200 shadow-2xl">
              <div className="p-6 border-b flex items-center justify-between sticky top-0 bg-white">
                <div className="flex items-center gap-3">
                  <Dog className="w-6 h-6 text-primary" />
                  <h3 className="text-2xl font-bold">Cadastrar Pet</h3>
                </div>
                <button onClick={closeModal} className="p-2 hover:bg-slate-100 rounded-lg">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleAddPet} className="p-6 space-y-5">
                {temRascunho('pet', editingPetId) && (
                  <div className="p-3 bg-amber-50 text-amber-800 rounded-xl text-sm flex items-center justify-between gap-3 border border-amber-200">
                    <span>Rascunho recuperado.</span>
                    <button
                      type="button"
                      onClick={() => {
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
                      className="shrink-0 px-3 py-1.5 font-semibold rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900"
                    >
                      Descartar
                    </button>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Foto do Pet</label>
                  <div className="flex items-center gap-4">
                    <div className="relative w-20 h-20 rounded-full border-2 border-dashed border-slate-300 flex items-center justify-center overflow-hidden bg-slate-50 hover:border-primary transition-colors cursor-pointer"
                      onClick={() => document.getElementById('pet-photo-input')?.click()}>
                      {petPhoto
                        ? <img src={petPhoto} alt="Foto do pet" className="w-full h-full object-cover" />
                        : <div className="flex flex-col items-center gap-1 text-slate-400">
                            <Dog className="w-7 h-7" />
                            <span className="text-xs">Foto</span>
                          </div>
                      }
                    </div>
                    <div className="flex flex-col gap-2">
                      <button type="button" onClick={() => document.getElementById('pet-photo-input')?.click()}
                        className="px-3 py-2 text-sm font-medium rounded-xl border border-primary text-primary hover:bg-primary/10 transition-all">
                        {petPhoto ? 'Alterar foto' : 'Enviar foto'}
                      </button>
                      {petPhoto && (
                        <button type="button" onClick={() => setPetPhoto('')}
                          className="px-3 py-2 text-sm font-medium rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-100 transition-all">
                          Remover
                        </button>
                      )}
                    </div>
                    <input id="pet-photo-input" type="file" accept="image/*" className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        const reader = new FileReader();
                        reader.onload = (ev) => setPetPhoto(ev.target?.result as string);
                        reader.readAsDataURL(file);
                        e.target.value = '';
                      }} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Tutor</label>
                    <select
                      value={petForm.tutorId}
                      onChange={(e) => setPetForm({ ...petForm, tutorId: e.target.value })}
                      required
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-primary font-medium"
                    >
                      <option value="">Selecione o tutor</option>
                      {currentVetTutors.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Nome do Pet</label>
                    <input
                      type="text"
                      value={petForm.name}
                      onChange={(e) => setPetForm({ ...petForm, name: e.target.value })}
                      placeholder="Nome do Pet"
                      required
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-primary font-medium"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Raça</label>
                    <input
                      type="text"
                      value={petForm.breed}
                      onChange={(e) => setPetForm({ ...petForm, breed: e.target.value })}
                      placeholder="Raça"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-primary font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Espécie</label>
                    <select
                      value={petForm.species}
                      onChange={(e) => setPetForm({ ...petForm, species: e.target.value })}
                      required
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-primary font-medium"
                    >
                      <option value="">Selecione espécie</option>
                      <option value="Cao">Cão</option>
                      <option value="Gato">Gato</option>
                      <option value="Ave">Ave</option>
                      <option value="Reptil">Réptil</option>
                      <option value="Roedor">Roedor</option>
                      <option value="Outro">Outro</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Idade (anos)</label>
                    <input
                      type="number"
                      min={0}
                      value={petForm.age}
                      onChange={(e) => setPetForm({ ...petForm, age: e.target.value })}
                      placeholder="Idade"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-primary font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Peso (kg)</label>
                    <input
                      type="number"
                      step="0.1"
                      min={0}
                      value={petForm.weight}
                      onChange={(e) => setPetForm({ ...petForm, weight: e.target.value })}
                      placeholder="Peso em kg"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-primary font-medium"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Sexo</label>
                    <select
                      value={petForm.sex}
                      onChange={(e) => setPetForm({ ...petForm, sex: e.target.value })}
                      required
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-primary font-medium"
                    >
                      <option value="">Selecione o sexo</option>
                      <option value="Macho">Macho</option>
                      <option value="Femea">Fêmea</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Cor</label>
                    <input
                      type="text"
                      value={petForm.color}
                      onChange={(e) => setPetForm({ ...petForm, color: e.target.value })}
                      placeholder="Cor"
                      required
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-primary font-medium"
                    />
                  </div>
                </div>
                <div className="flex gap-3 pt-4">
                  <button type="button" onClick={closeModal} className="flex-1 px-4 py-3 border-2 text-slate-700 font-bold rounded-xl hover:bg-slate-100">
                    Cancelar
                  </button>
                  <button type="submit" className="flex-1 px-4 py-3 bg-gradient-to-r from-primary to-secondary text-white font-bold rounded-xl">
                    Salvar
                  </button>
                </div>
              </form>
            </div>
          )}

          {isModalOpen === 'appointment' && (
            <div className="bg-white rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto border border-slate-200 shadow-2xl">
              <div className="p-6 border-b flex items-center justify-between sticky top-0 bg-white">
                <div className="flex items-center gap-3">
                  <Calendar className="w-6 h-6 text-primary" />
                  <h3 className="text-2xl font-bold">Agendar Consulta</h3>
                </div>
                <button onClick={closeModal} className="p-2 hover:bg-slate-100 rounded-lg">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleAddAppointment} className="p-6 space-y-5">
                {temRascunho('appointment', null) && (
                  <div className="p-3 bg-amber-50 text-amber-800 rounded-xl text-sm flex items-center justify-between gap-3 border border-amber-200">
                    <span>Rascunho recuperado.</span>
                    <button
                      type="button"
                      onClick={() => {
                        limparRascunho('appointment', null);
                        setAppointmentForm(emptyAppointmentForm());
                      }}
                      className="shrink-0 px-3 py-1.5 font-semibold rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900"
                    >
                      Descartar
                    </button>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Pet</label>
                  <select
                    value={appointmentForm.petId}
                    onChange={(e) => setAppointmentForm({ ...appointmentForm, petId: e.target.value })}
                    required
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-primary font-medium"
                  >
                    <option value="">Selecione o pet</option>
                    {currentVetPets.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Data</label>
                  <input
                    type="date"
                    value={appointmentForm.date}
                    onChange={(e) => setAppointmentForm({ ...appointmentForm, date: e.target.value })}
                    required
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-primary font-medium"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Hora</label>
                  <input
                    type="time"
                    value={appointmentForm.time}
                    onChange={(e) => setAppointmentForm({ ...appointmentForm, time: e.target.value })}
                    required
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-primary font-medium"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Motivo da Consulta</label>
                  <textarea
                    value={appointmentForm.reason}
                    onChange={(e) => setAppointmentForm({ ...appointmentForm, reason: e.target.value })}
                    rows={3}
                    placeholder="Descreva o motivo da consulta"
                    required
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-primary font-medium resize-none"
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <button type="button" onClick={closeModal} className="flex-1 px-4 py-3 border-2 text-slate-700 font-bold rounded-xl hover:bg-slate-100">
                    Cancelar
                  </button>
                  <button type="submit" className="flex-1 px-4 py-3 bg-gradient-to-r from-primary to-secondary text-white font-bold rounded-xl">
                    Agendar
                  </button>
                </div>
              </form>
            </div>
          )}

          {isModalOpen === 'consultation' && (
            <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-slate-200 shadow-2xl">
              <div className="p-6 border-b flex items-center justify-between sticky top-0 bg-white">
                <div className="flex items-center gap-3">
                  <ClipboardList className="w-6 h-6 text-primary" />
                  <h3 className="text-2xl font-bold">{editingConsultationId ? 'Editar Prontuário' : 'Registrar Prontuário'}</h3>
                </div>
                <button onClick={closeModal} className="p-2 hover:bg-slate-100 rounded-lg">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleAddConsultation} className="p-6 space-y-5">
                {temRascunho('consultation', editingConsultationId) && (
                  <div className="p-3 bg-amber-50 text-amber-800 rounded-xl text-sm flex items-center justify-between gap-3 border border-amber-200">
                    <span>Rascunho recuperado.</span>
                    <button
                      type="button"
                      onClick={() => {
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
                      className="shrink-0 px-3 py-1.5 font-semibold rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900"
                    >
                      Descartar
                    </button>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Pet</label>
                  <select
                    value={consultationForm.petId}
                    onChange={(e) => setConsultationForm({ ...consultationForm, petId: e.target.value })}
                    required
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-primary font-medium"
                  >
                    <option value="">Selecione o pet</option>
                    {currentVetPets.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Data</label>
                  <input
                    type="date"
                    value={consultationForm.date}
                    onChange={(e) => setConsultationForm({ ...consultationForm, date: e.target.value })}
                    required
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-primary font-medium"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Hora</label>
                  <input
                    type="time"
                    value={consultationForm.time}
                    onChange={(e) => setConsultationForm({ ...consultationForm, time: e.target.value })}
                    required
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-primary font-medium"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Motivo da Consulta</label>
                  <textarea
                    value={consultationForm.reason}
                    onChange={(e) => setConsultationForm({ ...consultationForm, reason: e.target.value })}
                    rows={2}
                    placeholder="Descreva o motivo da consulta"
                    required
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-primary font-medium resize-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Diagnóstico</label>
                  <textarea
                    value={consultationForm.diagnosis}
                    onChange={(e) => setConsultationForm({ ...consultationForm, diagnosis: e.target.value })}
                    rows={3}
                    placeholder="Descreva o diagnóstico"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-primary font-medium resize-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Prescrição / Recomendações</label>
                  <textarea
                    value={consultationForm.prescription}
                    onChange={(e) => setConsultationForm({ ...consultationForm, prescription: e.target.value })}
                    rows={3}
                    placeholder="Medicamentos, dosagem, recomendações..."
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-primary font-medium resize-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Observações Gerais</label>
                  <textarea
                    value={consultationForm.notes}
                    onChange={(e) => setConsultationForm({ ...consultationForm, notes: e.target.value })}
                    rows={2}
                    placeholder="Observações adicionais"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-primary font-medium resize-none"
                  />
                </div>
                <div className="p-3 bg-blue-50 text-blue-600 rounded text-sm">
                  Este prontuário será enviado por email ao tutor.
                </div>
                <div className="flex gap-3 pt-4">
                  <button type="button" onClick={closeModal} className="flex-1 px-4 py-3 border-2 text-slate-700 font-bold rounded-xl hover:bg-slate-100">
                    Cancelar
                  </button>
                  <button type="submit" className="flex-1 px-4 py-3 bg-gradient-to-r from-primary to-secondary text-white font-bold rounded-xl">
                    {editingConsultationId ? 'Atualizar' : 'Registrar'}
                  </button>
                </div>
              </form>
            </div>
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