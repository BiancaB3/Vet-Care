'use client';

import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import {
  Mail, Lock, Bell, LogOut, Calendar, Users, Dog, ClipboardList,
  Plus, Search, X, TrendingUp, CalendarX, User, CheckCircle,
  Trash2, Edit2, UserPlus, PlusCircle, FilePlus, Eye, EyeOff,
  Cat, Feather, Mouse, Turtle, Check, X as XIcon
} from 'lucide-react';
import { useDispatch } from 'react-redux';
import { useVet, Veterinarian, Tutor, Pet, Appointment, Consultation } from '../types/VetContext';
import { useAuth } from '../types/AuthContext';
import {
  useDraft,
  emptyDraftByKind,
  type AppointmentDraft,
  type PetDraft,
  type ConsultationDraft,
  type DraftKind,
} from '../types/DraftContext';
import api from '../services/api';
import { loginService } from '../services/authService';
import { criarTutor, atualizarTutor, excluirTutor, buscarEnderecoPorCep } from '../services/tutorService';
import { setToken, setUsuario } from '../redux/slices/authSlice';
import VetCareAuthPanel from './VetCareAuthPanel';
import VetCareDashboardHeader from './VetCareDashboardHeader';
import VetCareVeterinarioSection from './VetCareVeterinarioSection';
import VetCareTutorModal from './VetCareTutorModal';
import VetCarePetModal from './VetCarePetModal';
import VetCareAppointmentModal from './VetCareAppointmentModal';
import VetCareConsultationModal from './VetCareConsultationModal';
import AgendaFeatureContainer from '../features/agenda/AgendaFeatureContainer';
import TutorFeatureContainer from '../features/tutores/TutorFeatureContainer';
import PetFeatureContainer from '../features/pets/PetFeatureContainer';
import ProntuarioFeatureContainer from '../features/prontuarios/ProntuarioFeatureContainer';

interface VeterinarioApi {
  id: number;
  nome: string;
  crmv: string;
  especialidade: string;
  telefone: string;
  email: string;
}

interface TutorApiResponse {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  cpf?: string | null;
  cep?: string | null;
  endereco?: string | null;
}

const emptyAppointmentForm = (): AppointmentDraft => emptyDraftByKind('appointment');

type VetCareAppProps = {
  initialSection?: 'agenda' | 'tutores' | 'pets' | 'prontuarios' | 'veterinarios';
  embedded?: boolean;
};

type TutorPayloadInput = {
  nome: string;
  email: string;
  telefone: string;
  cpf: string;
  cep: string;
  endereco: string;
  status: 'ATIVO';
};

const VetCareApp: React.FC<VetCareAppProps> = ({ initialSection = 'agenda', embedded = false }) => {
  const { currentVet, login, logout, pets, addPet, updatePet, deletePet, appointments, addAppointment, updateAppointment, deleteAppointment, updateAppointmentStatus, consultations, addConsultation, updateConsultation, deleteConsultation } = useVet();
  const { token } = useAuth();
  const { getDraft, salvarProgresso, limparRascunho, temRascunho } = useDraft();
  const dispatch = useDispatch();
  const skipDraftSaveRef = useRef<Record<DraftKind, boolean>>({
    appointment: false,
    tutor: false,
    pet: false,
    consultation: false,
  });

  const [screen, setScreen] = useState<'login' | 'register' | 'forgot' | 'dashboard'>(embedded ? 'dashboard' : 'login');
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
        const lista = await carregarTutoresDaApi();
        setApiTutors(lista);
      } catch {
        showToast('Nao foi possivel carregar os tutores.');
      }
    };

    carregarTutores();
  }, [currentVet, token]);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [editingConsultationId, setEditingConsultationId] = useState<string | null>(null);
  const [editingPetId, setEditingPetId] = useState<string | null>(null);
  const [editingTutorId, setEditingTutorId] = useState<string | null>(null);
  const [hasUnread, setHasUnread] = useState(false);
  const [toast, setToast] = useState<{ message: string; show: boolean }>({ message: '', show: false });
  const [showPassword, setShowPassword] = useState(false);
  const [deleteConfirmModal, setDeleteConfirmModal] = useState<{ show: boolean; type: string; id: string; name: string }>({ show: false, type: '', id: '', name: '' });

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

  const carregarTutoresDaApi = async (): Promise<Tutor[]> => {
    const response = await api.get<TutorApiResponse[]>('/tutores');
    return response.data.map((item) => ({
      id: String(item.id),
      vetId: currentVet?.id ?? 'api',
      name: item.nome,
      email: item.email,
      phone: item.telefone,
      cpf: item.cpf ?? '',
      cep: item.cep ?? '',
      endereco: item.endereco ?? '',
      createdAt: new Date(),
    }));
  };

  useEffect(() => {
    setActiveSection(initialSection);
  }, [initialSection]);

  const showToast = (message: string) => {
    setToast({ message, show: true });
    setTimeout(() => setToast({ message: '', show: false }), 3000);
  };

  const extractErrorMessage = (error: unknown): string | null => {
    if (axios.isAxiosError(error)) {
      const backendData = error.response?.data;

      if (typeof backendData === 'string' && backendData.trim().length > 0) {
        return backendData;
      }

      if (
        typeof backendData === 'object' &&
        backendData !== null &&
        'message' in backendData &&
        typeof backendData.message === 'string' &&
        backendData.message.trim().length > 0
      ) {
        return backendData.message;
      }

      if (
        typeof backendData === 'object' &&
        backendData !== null &&
        'mensagem' in backendData &&
        typeof backendData.mensagem === 'string' &&
        backendData.mensagem.trim().length > 0
      ) {
        return backendData.mensagem;
      }

      if (typeof error.message === 'string' && error.message.trim().length > 0) {
        return error.message;
      }
    }

    if (error instanceof Error && error.message.trim().length > 0) {
      return error.message;
    }

    return null;
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

  const handleTutorFormChange = (next: typeof tutorForm) => {
    setTutorForm({
      ...next,
      cpf: formatCpf(next.cpf),
      cep: formatCep(next.cep),
    });
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

  const mapTutorPayloadToModel = (id: string, payload: TutorPayloadInput): Tutor => ({
    id,
    vetId: 'api',
    name: payload.nome,
    email: payload.email,
    phone: payload.telefone,
    cpf: payload.cpf,
    cep: payload.cep,
    endereco: payload.endereco,
    createdAt: new Date(),
  });

  const criarTutorComFallback = async (payload: TutorPayloadInput): Promise<Tutor> => {
    if (typeof criarTutor === 'function') {
      return criarTutor(payload);
    }

    const response = await api.post<{ id: number }>('/tutores', payload);
    const createdId = response.data?.id != null ? String(response.data.id) : Date.now().toString();
    return mapTutorPayloadToModel(createdId, payload);
  };

  const atualizarTutorComFallback = async (id: number, payload: TutorPayloadInput): Promise<Tutor> => {
    if (typeof atualizarTutor === 'function') {
      return atualizarTutor(id, payload);
    }

    await api.put(`/tutores/${id}`, payload);
    return mapTutorPayloadToModel(String(id), payload);
  };

  const excluirTutorComFallback = async (id: number): Promise<void> => {
    if (typeof excluirTutor === 'function') {
      await excluirTutor(id);
      return;
    }

    await api.delete(`/tutores/${id}`);
  };

  const preencherEnderecoPorCep = async (cepValue: string) => {
    const cepNormalizado = onlyDigits(cepValue);
    if (cepNormalizado.length !== 8) {
      return;
    }

    setIsCepLoading(true);
    try {
      const endereco =
        typeof buscarEnderecoPorCep === 'function'
          ? await buscarEnderecoPorCep(cepNormalizado)
          : (await api.get(`api/enderecos/${cepNormalizado}`)).data;

      setTutorForm((prev) => ({
        ...prev,
        cep: formatCep(cepNormalizado),
        street: endereco.logradouro ?? '',
        district: endereco.bairro ?? '',
        city: endereco.localidade ?? '',
        state: endereco.uf ?? '',
      }));
    } catch (error) {
      try {
        // Fallback: consulta direta no ViaCEP quando houver falha de backend/rede.
        const response = await fetch(`https://viacep.com.br/ws/${cepNormalizado}/json/`);
        if (response.ok) {
          const data: {
            erro?: boolean;
            logradouro?: string;
            bairro?: string;
            localidade?: string;
            uf?: string;
          } = await response.json();

          if (!data.erro) {
            setTutorForm((prev) => ({
              ...prev,
              cep: formatCep(cepNormalizado),
              street: data.logradouro ?? '',
              district: data.bairro ?? '',
              city: data.localidade ?? '',
              state: data.uf ?? '',
            }));
            return;
          }
        }
      } catch (fallbackError) {
        console.error('Falha no fallback de consulta de CEP.', fallbackError);
      }

      console.error('Nao foi possivel consultar o CEP informado.', error);

      const rawMessage = extractErrorMessage(error);
      const isTechnicalMessage =
        rawMessage != null &&
        (rawMessage.includes('is not a function') ||
          rawMessage.includes('buscarEnderecoPorCep') ||
          rawMessage.includes('WEBPACK_IMPORTED_MODULE'));

      showToast(
        isTechnicalMessage
          ? 'Nao foi possivel consultar o CEP informado. Tente novamente.'
          : rawMessage ?? 'Nao foi possivel consultar o CEP informado.'
      );
    } finally {
      setIsCepLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const emailNormalizado = loginForm.email.trim();

    try {
      const loginResult = await loginService({
        email: emailNormalizado,
        senha: loginForm.password,
      });

      if (!loginResult?.token) {
        showToast('Email ou senha incorretos');
        return;
      }

      dispatch(setToken({ token: loginResult.token }));

      let veterinarioPerfil: VeterinarioApi | null = null;
      try {
        const resposta = await api.get<VeterinarioApi>('/veterinarios/logado');
        veterinarioPerfil = resposta.data;
      } catch {
        try {
          const resposta = await api.get<VeterinarioApi[]>('/veterinarios');
          veterinarioPerfil =
            resposta.data.find(
              (v) => v.email.toLowerCase() === emailNormalizado.toLowerCase(),
            ) ?? null;
        } catch {
          veterinarioPerfil = null;
        }
      }

      const usuario = {
        id: veterinarioPerfil?.id ?? null,
        nome: veterinarioPerfil?.nome || emailNormalizado,
        email: veterinarioPerfil?.email || emailNormalizado,
        status: 'ATIVO',
        senha: '',
        crmv: veterinarioPerfil?.crmv || 'Nao informado',
        telefone: veterinarioPerfil?.telefone || '',
      };
      dispatch(setUsuario({ usuario }));

      const vet: Veterinarian = {
        id: String(veterinarioPerfil?.id ?? emailNormalizado),
        name: veterinarioPerfil?.nome || emailNormalizado,
        email: veterinarioPerfil?.email || emailNormalizado,
        crmv: veterinarioPerfil?.crmv || 'Nao informado',
        phone: veterinarioPerfil?.telefone || '',
      };

      login(vet);
      setScreen('dashboard');
      setLoginForm({ email: '', password: '' });
      showToast('Login realizado com sucesso!');
    } catch (error: unknown) {
      const mensagem =
        axios.isAxiosError(error) && typeof error.response?.data === 'string'
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
    } catch (error: unknown) {
      const status = axios.isAxiosError(error) ? error.response?.status : undefined;
      const data = axios.isAxiosError(error) ? error.response?.data : undefined;

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
        await atualizarTutorComFallback(Number(editingTutorId), {
          nome: tutorForm.name,
          email: tutorForm.email,
          telefone: tutorForm.phone,
          cpf: cpfNormalizado,
          cep: cepNormalizado,
          endereco,
          status: 'ATIVO',
        });

        try {
          setApiTutors(await carregarTutoresDaApi());
        } catch (reloadError) {
          console.error('Falha ao recarregar lista de tutores apos atualizacao.', reloadError);
          showToast('Tutor atualizado, mas nao foi possivel recarregar a lista agora.');
        }

        setNotifications([...notifications, { id: Date.now().toString(), message: `Tutor "${tutorForm.name}" atualizado com sucesso`, type: 'edicao' }]);
        setHasUnread(true);
        showToast('Tutor atualizado com sucesso!');
      } else {
        await criarTutorComFallback({
          nome: tutorForm.name,
          email: tutorForm.email,
          telefone: tutorForm.phone,
          cpf: cpfNormalizado,
          cep: cepNormalizado,
          endereco,
          status: 'ATIVO',
        });

        try {
          setApiTutors(await carregarTutoresDaApi());
        } catch (reloadError) {
          console.error('Falha ao recarregar lista de tutores apos cadastro.', reloadError);
          showToast('Tutor cadastrado, mas nao foi possivel recarregar a lista agora.');
        }

        setNotifications([...notifications, { id: Date.now().toString(), message: `Tutor "${tutorForm.name}" cadastrado com sucesso`, type: 'cadastro' }]);
        setHasUnread(true);
        showToast('Tutor cadastrado com sucesso!');
      }
    } catch (error: unknown) {
      showToast(extractErrorMessage(error) ?? 'Nao foi possivel salvar o tutor.');
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
      await excluirTutorComFallback(Number(id));
      setApiTutors(await carregarTutoresDaApi());
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
    if (embedded) {
      return null;
    }

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

  const sectionContent = (
    <>
      {activeSection === 'agenda' && (
        <AgendaFeatureContainer
          currentVetAppointments={currentVetAppointments}
          currentVetPets={currentVetPets}
          currentVetTutors={currentVetTutors}
          onOpenAppointmentModal={() => openModal('appointment')}
          onDeleteAppointment={handleDeleteAppointment}
          onToggleAppointmentConfirmation={(id, confirmed) => updateAppointment(id, { confirmed })}
          onShowToast={showToast}
        />
      )}

      {activeSection === 'tutores' && (
        <TutorFeatureContainer
          currentVetTutors={currentVetTutors}
          onOpenTutorModal={(id) => openModal('tutor', id)}
          onDeleteTutor={handleDeleteTutor}
        />
      )}

      {activeSection === 'pets' && (
        <PetFeatureContainer
          currentVetPets={currentVetPets}
          currentVetTutors={currentVetTutors}
          onOpenPetModal={(id) => openModal('pet', id)}
          onDeletePet={handleDeletePet}
        />
      )}

      {activeSection === 'prontuarios' && (
        <ProntuarioFeatureContainer
          currentVetConsultations={currentVetConsultations}
          currentVetPets={currentVetPets}
          onOpenConsultationModal={(id) => openModal('consultation', id)}
          onDeleteConsultation={handleDeleteConsultation}
        />
      )}

      {activeSection === 'veterinarios' && <VetCareVeterinarioSection currentVet={currentVet} />}
    </>
  );

  // Dashboard
  return (
    <div className={`${embedded ? 'w-full' : 'h-screen'} w-full flex flex-col bg-background overflow-hidden`}>
      {!embedded && (
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
      )}

      <div className="flex flex-1 overflow-hidden">
        {!embedded && (
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
        )}

        <main className={`flex-1 overflow-auto p-6 ${embedded ? 'bg-transparent' : 'bg-gradient-to-br from-slate-50 via-emerald-50 to-blue-50'} scrollbar-thin`}>
          {sectionContent}
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
              onTutorFormChange={handleTutorFormChange}
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

    </div>
  );
};

export default VetCareApp;