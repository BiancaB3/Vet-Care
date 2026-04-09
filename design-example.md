<!doctype html>
<html lang="pt-BR" class="h-full">
 <head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>VetCare - Sistema de Gestão Veterinária</title>
  <script src="https://cdn.tailwindcss.com/3.4.17"></script>
  <script src="https://cdn.jsdelivr.net/npm/lucide@0.263.0/dist/umd/lucide.min.js"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&amp;display=swap" rel="stylesheet">
  <script src="/_sdk/data_sdk.js"></script>
  <script src="/_sdk/element_sdk.js"></script>
  <style>
    * { font-family: 'Plus Jakarta Sans', sans-serif; }
    
    html, body, #app { height: 100%; }
    
    .gradient-primary { background: linear-gradient(135deg, #6b9080 0%, #5a7d71 100%); }
    .text-primary { color: #6b9080; }
    
    .sidebar {
      background: linear-gradient(180deg, #5a7d71 0%, #4a6d61 100%);
      width: 280px;
      height: 100%;
      position: fixed;
      left: 0;
      top: 0;
      overflow-y: auto;
      box-shadow: 4px 0 15px rgba(0,0,0,0.1);
      z-index: 100;
    }
    
    .sidebar-btn {
      width: 100%;
      padding: 12px 20px;
      text-align: left;
      border: none;
      background: transparent;
      color: #e0f7ee;
      cursor: pointer;
      font-size: 15px;
      font-weight: 500;
      transition: all 0.3s;
      display: flex;
      align-items: center;
      gap: 12px;
      margin: 4px 0;
    }
    
    .sidebar-btn:hover {
      background: rgba(255,255,255,0.1);
      color: white;
      padding-left: 24px;
    }
    
    .sidebar-btn.active {
      background: rgba(46, 204, 113, 0.3);
      color: #2ecc71;
      font-weight: 600;
      border-left: 4px solid #2ecc71;
    }
    
    .main-content {
      margin-left: 280px;
      height: 100%;
      display: flex;
      flex-direction: column;
    }
    
    .btn-primary {
      background: linear-gradient(135deg, #2ecc71 0%, #27ae60 100%);
      color: white;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 0.75rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
    }
    
    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 16px rgba(107, 144, 128, 0.3);
    }
    
    .btn-secondary {
      background: #f1f5f9;
      color: #475569;
      border: 1px solid #e2e8f0;
      padding: 0.75rem 1.5rem;
      border-radius: 0.75rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
    }
    
    .btn-secondary:hover {
      background: #e2e8f0;
      border-color: #cbd5e1;
    }
    
    .card-hover {
      transition: all 0.3s ease;
    }
    
    .card-hover:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 24px rgba(107, 144, 128, 0.15);
    }
    
    .loading-spinner {
      display: inline-block;
      width: 20px;
      height: 20px;
      border: 3px solid rgba(107, 144, 128, 0.3);
      border-top: 3px solid #6b9080;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }
    
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    
    .profile-avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-center: center;
      color: white;
      font-weight: 700;
      font-size: 16px;
      flex-shrink: 0;
    }
    
    .notification-bell {
      position: relative;
      cursor: pointer;
      transition: all 0.2s;
    }
    
    .notification-bell:hover {
      transform: scale(1.1);
    }
    
    .notification-badge {
      position: absolute;
      top: -8px;
      right: -8px;
      background: #ef4444;
      color: white;
      border-radius: 50%;
      width: 22px;
      height: 22px;
      display: flex;
      align-items: center;
      justify-center: center;
      font-size: 11px;
      font-weight: bold;
    }
    
    .notification-dropdown {
      position: absolute;
      top: 100%;
      right: 0;
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 0.75rem;
      width: 320px;
      max-height: 400px;
      overflow-y: auto;
      box-shadow: 0 10px 25px rgba(0,0,0,0.15);
      z-index: 1000;
      margin-top: 8px;
    }
    
    .notification-item {
      padding: 12px 16px;
      border-bottom: 1px solid #f3f4f6;
      cursor: pointer;
      transition: background 0.2s;
    }
    
    .notification-item:hover {
      background: #f9fafb;
    }
    
    .notification-item.unread {
      background: #f0fdf4;
      border-left: 3px solid #6b9080;
    }
  </style>
  <style>body { box-sizing: border-box; }</style>
 </head>
 <body class="h-full bg-slate-50 text-slate-900" style="box-sizing: border-box;">
  <div id="app" class="h-full w-full flex">
   <!-- Sidebar -->
   <div class="sidebar hidden" id="sidebar">
    <div class="p-6 border-b border-emerald-600">
     <div class="flex items-center gap-3 mb-4">
      <div class="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center">
       <i data-lucide="stethoscope" class="w-6 h-6 text-white"></i>
      </div>
      <div>
       <h2 class="text-xl font-bold text-white">VetCare</h2>
       <p class="text-xs text-emerald-200">Sistema Pro</p>
      </div>
     </div>
     <p id="sidebar-vet-name" class="text-sm text-emerald-100 font-semibold"></p>
     <p id="sidebar-vet-crmv" class="text-xs text-emerald-200"></p>
    </div>
    <nav class="p-4 space-y-2">
     <button class="sidebar-btn active" data-tab="dashboard" onclick="switchTab('dashboard')"> <i data-lucide="home" style="width: 20px; height: 20px;"></i> Dashboard </button> <button class="sidebar-btn" data-tab="agenda" onclick="switchTab('agenda')"> <i data-lucide="calendar" style="width: 20px; height: 20px;"></i> Agenda </button> <button class="sidebar-btn" data-tab="pets" onclick="switchTab('pets')"> <i data-lucide="dog" style="width: 20px; height: 20px;"></i> Pets </button> <button class="sidebar-btn" data-tab="tutores" onclick="switchTab('tutores')"> <i data-lucide="users" style="width: 20px; height: 20px;"></i> Tutores </button> <button class="sidebar-btn" data-tab="prontuarios" onclick="switchTab('prontuarios')"> <i data-lucide="file-text" style="width: 20px; height: 20px;"></i> Prontuários </button>
    </nav>
    <div class="absolute bottom-6 left-4 right-4">
     <button onclick="handleLogout()" class="w-full py-2.5 px-4 bg-red-500/20 text-red-200 rounded-lg hover:bg-red-500/30 transition-all flex items-center justify-center gap-2 font-semibold"> <i data-lucide="log-out" style="width: 18px; height: 18px;"></i> Sair </button>
    </div>
   </div><!-- Main Content -->
   <div class="main-content">
    <!-- Login Screen -->
    <div id="login-screen" class="h-full w-full flex items-center justify-center p-6 absolute inset-0 z-50 bg-slate-50">
     <div class="w-full max-w-md">
      <div class="text-center mb-10">
       <div class="inline-flex items-center justify-center w-24 h-24 gradient-primary rounded-3xl mb-6 shadow-lg">
        <i data-lucide="stethoscope" class="w-14 h-14 text-white"></i>
       </div>
       <h1 class="text-4xl font-bold mb-2 text-slate-900">VetCare</h1>
       <p class="text-lg text-slate-600">Sistema de Gestão Veterinária</p>
      </div>
      <div class="bg-white rounded-3xl p-8 shadow-2xl border border-slate-200">
       <!-- Login Form -->
       <div id="login-form" class="space-y-5">
        <div>
         <label class="block text-sm font-semibold text-slate-700 mb-3">Email</label> <input type="email" id="login-email" placeholder="seu@email.com" class="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:border-primary font-medium">
        </div>
        <div>
         <label class="block text-sm font-semibold text-slate-700 mb-3">Senha</label> <input type="password" id="login-password" placeholder="••••••••" class="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:border-primary font-medium">
        </div><button onclick="handleLogin()" class="w-full py-3.5 gradient-primary hover:shadow-lg text-white font-bold rounded-xl transition-all">Entrar</button>
        <p class="text-center text-sm text-slate-600">Não tem conta? <button type="button" onclick="toggleRegister()" class="text-emerald-600 hover:text-emerald-700 font-bold">Cadastre-se</button></p>
       </div><!-- Register Form -->
       <div id="register-form" class="hidden space-y-4">
        <h3 class="text-xl font-bold text-slate-900 mb-6">Criar Conta</h3><input type="text" id="register-name" placeholder="Dr(a). Nome" class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:border-primary font-medium"> <input type="text" id="register-crmv" placeholder="CRMV-XX/12345" class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:border-primary font-medium"> <input type="email" id="register-email" placeholder="seu@email.com" class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:border-primary font-medium"> <input type="password" id="register-password" placeholder="••••••••" class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:border-primary font-medium"> <input type="tel" id="register-phone" placeholder="(11) 99999-9999" class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:border-primary font-medium" maxlength="15">
        <div class="flex gap-3 pt-4">
         <button type="button" onclick="toggleRegister()" class="flex-1 px-4 py-2.5 border-2 border-slate-300 text-slate-700 font-bold rounded-xl hover:bg-slate-100 transition-all">Voltar</button> <button onclick="handleRegister()" class="flex-1 px-4 py-2.5 gradient-primary hover:shadow-lg text-white font-bold rounded-xl transition-all">Cadastrar</button>
        </div>
       </div>
      </div>
     </div>
    </div><!-- Header -->
    <header class="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
     <div class="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
      <h1 class="text-2xl font-bold text-slate-900" id="page-title">Dashboard</h1>
      <div class="flex items-center gap-6">
       <div class="relative"><button class="notification-bell" onclick="toggleNotifications()"> <i data-lucide="bell" class="w-6 h-6 text-slate-700"></i> <span class="notification-badge" id="notification-count">0</span> </button>
        <div class="notification-dropdown hidden" id="notification-dropdown">
         <div class="p-4 border-b border-slate-200">
          <h3 class="font-semibold text-slate-900">Notificações</h3>
         </div>
         <div id="notification-list" class="divide-y">
          <div class="p-4 text-center text-slate-500">
           Nenhuma notificação
          </div>
         </div>
        </div>
       </div>
       <div class="flex items-center gap-3 pl-6 border-l border-slate-200">
        <div class="text-right">
         <p class="text-sm font-semibold text-slate-900" id="profile-name">Veterinário</p>
         <p class="text-xs text-slate-500" id="profile-crmv">CRMV</p>
        </div>
        <div class="profile-avatar gradient-primary" id="profile-avatar">
         V
        </div>
       </div>
      </div>
     </div>
    </header><!-- Dashboard Content -->
    <main class="flex-1 overflow-auto px-6 py-8 bg-slate-50">
     <div class="max-w-6xl mx-auto">
      <!-- Dashboard Tab -->
      <div id="dashboard" class="tab-content">
       <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div class="card-hover bg-white rounded-xl p-6 border border-slate-200">
         <div class="flex items-center justify-between">
          <div>
           <p class="text-slate-600 text-sm mb-2">Consultas Hoje</p>
           <p class="text-3xl font-bold text-slate-900" id="dash-today-count">0</p>
          </div>
          <div class="w-12 h-12 gradient-primary rounded-lg flex items-center justify-center">
           <i data-lucide="calendar" class="text-white" style="width: 24px; height: 24px;"></i>
          </div>
         </div>
        </div>
        <div class="card-hover bg-white rounded-xl p-6 border border-slate-200">
         <div class="flex items-center justify-between">
          <div>
           <p class="text-slate-600 text-sm mb-2">Total de Pets</p>
           <p class="text-3xl font-bold text-slate-900" id="dash-pets-count">0</p>
          </div>
          <div class="w-12 h-12 gradient-primary rounded-lg flex items-center justify-center">
           <i data-lucide="dog" class="text-white" style="width: 24px; height: 24px;"></i>
          </div>
         </div>
        </div>
        <div class="card-hover bg-white rounded-xl p-6 border border-slate-200">
         <div class="flex items-center justify-between">
          <div>
           <p class="text-slate-600 text-sm mb-2">Total de Tutores</p>
           <p class="text-3xl font-bold text-slate-900" id="dash-tutores-count">0</p>
          </div>
          <div class="w-12 h-12 gradient-primary rounded-lg flex items-center justify-center">
           <i data-lucide="users" class="text-white" style="width: 24px; height: 24px;"></i>
          </div>
         </div>
        </div>
       </div>
       <div class="bg-white rounded-xl p-6 border border-slate-200">
        <h3 class="text-xl font-bold mb-4 text-slate-900">Próximas Consultas</h3>
        <div id="dashboard-schedule" class="space-y-2 text-slate-600">
         <p class="text-center py-8">Nenhuma consulta agendada</p>
        </div>
       </div>
       <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <div class="bg-white rounded-xl p-6 border border-slate-200">
         <h3 class="text-lg font-bold mb-4 text-slate-900">Agendamentos Pendentes</h3>
         <div id="pending-appointments" class="space-y-2 text-sm">
          <p class="text-center py-6 text-slate-500">Nenhum pendente</p>
         </div>
        </div>
        <div class="bg-white rounded-xl p-6 border border-slate-200">
         <h3 class="text-lg font-bold mb-4 text-slate-900">Notificações Recentes</h3>
         <div id="recent-notifications" class="space-y-2 text-sm">
          <p class="text-center py-6 text-slate-500">Nenhuma notificação</p>
         </div>
        </div>
       </div>
      </div><!-- Agenda Tab -->
      <div id="agenda" class="tab-content hidden">
       <div class="bg-white rounded-xl p-6 border border-slate-200">
        <div class="flex items-center justify-between mb-6">
         <h3 class="text-xl font-bold text-slate-900">Agendar Consulta</h3><button onclick="showAgendaForm()" class="btn-primary"><i data-lucide="plus" style="width: 18px; height: 18px;"></i> Nova Consulta</button>
        </div>
        <form id="agendaForm" class="hidden space-y-4 p-4 bg-slate-50 rounded-lg mb-6">
         <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="text" id="agenda-pet" placeholder="Nome do Pet" class="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-primary"> <input type="text" id="agenda-tutor" placeholder="Nome do Tutor" class="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-primary"> <input type="tel" id="agenda-phone" placeholder="Telefone (WhatsApp)" class="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-primary"> <input type="date" id="agenda-date" class="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-primary"> <input type="time" id="agenda-time" class="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-primary"> <select id="agenda-status" class="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-primary"> <option value="pendente">Pendente</option> <option value="confirmado">Confirmado</option> </select> <textarea id="agenda-notes" placeholder="Motivo da consulta..." class="md:col-span-2 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-primary" rows="3"></textarea>
         </div>
         <div class="flex gap-2">
          <button type="button" onclick="saveAgenda()" class="btn-primary">Salvar Consulta</button> <button type="button" onclick="hideAgendaForm()" class="btn-secondary">Cancelar</button>
         </div>
        </form>
        <div id="agenda-list" class="space-y-3">
         <p class="text-center py-8 text-slate-600">Nenhuma consulta agendada</p>
        </div>
       </div>
      </div><!-- Pets Tab -->
      <div id="pets" class="tab-content hidden">
       <div class="bg-white rounded-xl p-6 border border-slate-200">
        <div class="flex items-center justify-between mb-6">
         <h3 class="text-xl font-bold text-slate-900">Cadastro de Pets</h3><button onclick="showPetForm()" class="btn-primary"><i data-lucide="plus" style="width: 18px; height: 18px;"></i> Novo Pet</button>
        </div>
        <form id="petForm" class="hidden space-y-4 p-4 bg-slate-50 rounded-lg mb-6">
         <div class="flex items-center gap-4 mb-4">
          <div id="pet-photo-preview" class="w-20 h-20 bg-slate-200 rounded-lg flex items-center justify-center overflow-hidden">
           <i data-lucide="dog" style="width: 40px; height: 40px; color: #94a3b8;"></i>
          </div><label class="flex-1"> <input type="file" id="pet-photo-input" accept="image/*" onchange="handlePetPhotoUpload()" class="hidden"> <span class="block px-4 py-2 bg-blue-500 text-white rounded-lg cursor-pointer hover:bg-blue-600 text-center font-semibold">Adicionar Foto</span> </label>
         </div>
         <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="text" id="pet-name" placeholder="Nome do Pet" class="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-primary"> <select id="pet-species" onchange="updatePetIconPreview()" class="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-primary"> <option value="">Espécie</option> <option value="Cão">Cão</option> <option value="Gato">Gato</option> <option value="Coelho">Coelho</option> <option value="Pássaro">Pássaro</option> <option value="Hamster">Hamster</option> <option value="Cobra">Cobra</option> <option value="Tartaruga">Tartaruga</option> </select> <input type="text" id="pet-breed" placeholder="Raça" class="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-primary"> <input type="number" id="pet-age" placeholder="Idade (anos)" class="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-primary"> <input type="number" id="pet-weight" placeholder="Peso (kg)" step="0.1" class="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-primary"> <input type="text" id="pet-tutor" placeholder="Tutor" class="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-primary">
         </div>
         <div class="flex gap-2">
          <button type="button" onclick="savePet()" class="btn-primary">Salvar Pet</button> <button type="button" onclick="hidePetForm()" class="btn-secondary">Cancelar</button>
         </div>
        </form>
        <div id="pets-list" class="grid grid-cols-1 md:grid-cols-2 gap-4">
         <p class="text-center py-8 text-slate-600 col-span-full">Nenhum pet cadastrado</p>
        </div>
       </div>
      </div><!-- Tutores Tab -->
      <div id="tutores" class="tab-content hidden">
       <div class="bg-white rounded-xl p-6 border border-slate-200">
        <div class="flex items-center justify-between mb-6">
         <h3 class="text-xl font-bold text-slate-900">Cadastro de Tutores</h3><button onclick="showTutorForm()" class="btn-primary"><i data-lucide="plus" style="width: 18px; height: 18px;"></i> Novo Tutor</button>
        </div>
        <form id="tutorForm" class="hidden space-y-4 p-4 bg-slate-50 rounded-lg mb-6">
         <div class="flex items-center gap-4 mb-4">
          <div id="tutor-photo-preview" class="w-20 h-20 bg-slate-200 rounded-lg flex items-center justify-center overflow-hidden">
           <i data-lucide="users" style="width: 40px; height: 40px; color: #94a3b8;"></i>
          </div><label class="flex-1"> <input type="file" id="tutor-photo-input" accept="image/*" onchange="handleTutorPhotoUpload()" class="hidden"> <span class="block px-4 py-2 bg-blue-500 text-white rounded-lg cursor-pointer hover:bg-blue-600 text-center font-semibold">Adicionar Foto</span> </label>
         </div><input type="text" id="tutor-name" placeholder="Nome do Tutor" class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-primary"> <input type="tel" id="tutor-phone" placeholder="Telefone" class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-primary"> <input type="email" id="tutor-email" placeholder="Email" class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-primary">
         <div class="flex gap-2">
          <button type="button" onclick="saveTutor()" class="btn-primary">Salvar Tutor</button> <button type="button" onclick="hideTutorForm()" class="btn-secondary">Cancelar</button>
         </div>
        </form>
        <div id="tutores-list" class="grid grid-cols-1 md:grid-cols-2 gap-4">
         <p class="text-center py-8 text-slate-600 col-span-full">Nenhum tutor cadastrado</p>
        </div>
       </div>
      </div><!-- Prontuários Tab -->
      <div id="prontuarios" class="tab-content hidden">
       <div class="bg-white rounded-xl p-6 border border-slate-200">
        <div class="flex items-center justify-between mb-6">
         <h3 class="text-xl font-bold text-slate-900">Prontuários</h3><button onclick="showConsultationForm()" class="btn-primary"><i data-lucide="plus" style="width: 18px; height: 18px;"></i> Novo Prontuário</button>
        </div>
        <form id="consultationForm" class="hidden space-y-4 p-4 bg-slate-50 rounded-lg mb-6">
         <input type="text" id="consultation-pet" placeholder="Nome do Pet" class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-primary"> <textarea id="consultation-diagnosis" placeholder="Diagnóstico..." class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-primary" rows="2"></textarea> <textarea id="consultation-prescription" placeholder="Prescrição..." class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-primary" rows="2"></textarea> <textarea id="consultation-notes" placeholder="Observações..." class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-primary" rows="2"></textarea>
         <div class="flex gap-2">
          <button type="button" onclick="saveConsultation()" class="btn-primary">Salvar Prontuário</button> <button type="button" onclick="hideConsultationForm()" class="btn-secondary">Cancelar</button>
         </div>
        </form>
        <div id="consultations-list" class="space-y-3">
         <p class="text-center py-8 text-slate-600">Nenhum prontuário registrado</p>
        </div>
       </div>
      </div>
     </div>
    </main>
   </div>
  </div>
  <script>
    lucide.createIcons();

    let allData = [];
    let currentVeterinarian = null;
    let notifications = [];
    let petPhotoData = null;
    let tutorPhotoData = null;

    const dataHandler = {
      onDataChanged(data) {
        allData = data;
        if (currentVeterinarian) {
          updateDashboard();
          updateAllLists();
          loadNotifications();
        }
      }
    };

    async function initSDK() {
      const result = await window.dataSdk.init(dataHandler);
      if (!result.isOk) console.error('SDK init failed');
    }

    function toggleRegister() {
      document.getElementById('login-form').classList.toggle('hidden');
      document.getElementById('register-form').classList.toggle('hidden');
    }

    function toggleSidebar() {
      document.getElementById('sidebar').classList.toggle('hidden');
    }

    function toggleNotifications() {
      const dropdown = document.getElementById('notification-dropdown');
      dropdown.classList.toggle('hidden');
    }

    function getAvatarColor(name) {
      const colors = ['#6b9080', '#5a7d71', '#8b7d6b', '#5a7d8b', '#6b7d80'];
      const charCode = name.charCodeAt(0);
      return colors[charCode % colors.length];
    }

    function getAvatarInitial(name) {
      return name.charAt(0).toUpperCase();
    }

    function getPetIcon(species) {
      const icons = {
        'Cão': 'dog',
        'Gato': 'cat',
        'Coelho': 'rabbit',
        'Pássaro': 'feather',
        'Hamster': 'mouse',
        'Cobra': 'zap',
        'Tartaruga': 'shield'
      };
      return icons[species] || 'heart';
    }

    async function handleLogin() {
      const email = document.getElementById('login-email').value;
      const password = document.getElementById('login-password').value;
      
      if (!email || !password) {
        showMessage('Preencha email e senha', 'error');
        return;
      }
      
      const vet = allData.find(d => d.type === 'veterinarian' && d.email === email && d.password === password);
      
      if (vet) {
        currentVeterinarian = vet;
        document.getElementById('login-screen').classList.add('hidden');
        document.getElementById('sidebar').classList.remove('hidden');
        updateSidebarVet();
        updateProfileHeader();
        switchTab('dashboard');
        document.getElementById('login-email').value = '';
        document.getElementById('login-password').value = '';
        showMessage(`Bem-vindo, ${vet.veterinarian_name}!`, 'success');
      } else {
        showMessage('Email ou senha incorretos', 'error');
      }
    }

    async function handleRegister() {
      const name = document.getElementById('register-name').value;
      const crmv = document.getElementById('register-crmv').value;
      const email = document.getElementById('register-email').value;
      const password = document.getElementById('register-password').value;
      const phone = document.getElementById('register-phone').value;
      
      if (!name || !crmv || !email || !password || !phone) {
        showMessage('Preencha todos os campos', 'error');
        return;
      }
      
      if (allData.some(d => d.type === 'veterinarian' && d.email === email)) {
        showMessage('Email já cadastrado', 'error');
        return;
      }
      
      const result = await window.dataSdk.create({
        type: 'veterinarian',
        veterinarian_name: name,
        crmv: crmv,
        email: email,
        password: password,
        phone: phone,
        avatar_color: getAvatarColor(name),
        created_at: new Date().toISOString()
      });
      
      if (result.isOk) {
        showMessage('Cadastro realizado! Faça login', 'success');
        toggleRegister();
        document.getElementById('register-name').value = '';
        document.getElementById('register-crmv').value = '';
        document.getElementById('register-email').value = '';
        document.getElementById('register-password').value = '';
        document.getElementById('register-phone').value = '';
      }
    }

    function handleLogout() {
      currentVeterinarian = null;
      document.getElementById('sidebar').classList.add('hidden');
      document.getElementById('login-screen').classList.remove('hidden');
      showMessage('Desconectado com sucesso', 'success');
    }

    function updateSidebarVet() {
      document.getElementById('sidebar-vet-name').textContent = currentVeterinarian.veterinarian_name || 'Veterinário';
      document.getElementById('sidebar-vet-crmv').textContent = currentVeterinarian.crmv || 'CRMV';
    }

    function updateProfileHeader() {
      document.getElementById('profile-name').textContent = currentVeterinarian.veterinarian_name || 'Veterinário';
      document.getElementById('profile-crmv').textContent = currentVeterinarian.crmv || 'CRMV';
      
      const avatar = document.getElementById('profile-avatar');
      avatar.textContent = getAvatarInitial(currentVeterinarian.veterinarian_name);
      avatar.style.background = currentVeterinarian.avatar_color || getAvatarColor(currentVeterinarian.veterinarian_name);
    }

    function loadNotifications() {
      const userNotifications = allData.filter(d => d.type === 'notification' && d.veterinarian_id === currentVeterinarian.__backendId).slice(-10);
      const unreadCount = userNotifications.filter(n => n.notification_read !== 'true').length;
      
      document.getElementById('notification-count').textContent = unreadCount;
      
      const list = document.getElementById('notification-list');
      if (userNotifications.length === 0) {
        list.innerHTML = '<div class="p-4 text-center text-slate-500 text-sm">Nenhuma notificação</div>';
      } else {
        list.innerHTML = userNotifications.map(notif => `
          <div class="notification-item ${notif.notification_read !== 'true' ? 'unread' : ''}">
            <p class="text-sm font-medium text-slate-900">${notif.notification_message}</p>
            <p class="text-xs text-slate-500 mt-1">${new Date(notif.created_at).toLocaleString('pt-BR')}</p>
          </div>
        `).join('');
      }
    }

    function showMessage(message, type = 'success') {
      const toast = document.createElement('div');
      toast.className = `fixed bottom-6 right-6 px-6 py-3.5 rounded-xl text-white font-semibold shadow-lg z-50 ${type === 'success' ? 'bg-emerald-500' : 'bg-red-500'}`;
      toast.textContent = message;
      document.body.appendChild(toast);
      
      setTimeout(() => toast.remove(), 3000);
    }

    function switchTab(tabName) {
      const titles = { dashboard: 'Dashboard', agenda: 'Agenda', pets: 'Pets', tutores: 'Tutores', prontuarios: 'Prontuários' };
      document.getElementById('page-title').textContent = titles[tabName];
      document.querySelectorAll('.tab-content').forEach(tab => tab.classList.add('hidden'));
      document.getElementById(tabName).classList.remove('hidden');
      document.querySelectorAll('.sidebar-btn').forEach(btn => btn.classList.remove('active'));
      document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
      
      // Fechar dropdown de notificações ao trocar de aba
      document.getElementById('notification-dropdown').classList.add('hidden');
    }

    function updateDashboard() {
      const today = new Date().toISOString().split('T')[0];
      const todayConsults = allData.filter(d => d.type === 'agenda' && d.appointment_date === today && d.veterinarian_id === currentVeterinarian.__backendId);
      const pets = allData.filter(d => d.type === 'pet' && d.veterinarian_id === currentVeterinarian.__backendId);
      const tutores = allData.filter(d => d.type === 'tutor' && d.veterinarian_id === currentVeterinarian.__backendId);
      const pendingAppointments = allData.filter(d => d.type === 'agenda' && d.appointment_status === 'pendente' && d.veterinarian_id === currentVeterinarian.__backendId);

      document.getElementById('dash-today-count').textContent = todayConsults.length;
      document.getElementById('dash-pets-count').textContent = pets.length;
      document.getElementById('dash-tutores-count').textContent = tutores.length;

      // Próximas consultas
      const scheduleList = document.getElementById('dashboard-schedule');
      if (todayConsults.length > 0) {
        scheduleList.innerHTML = todayConsults.map(item => `
          <div class="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <p class="font-semibold text-slate-900">${item.pet_name}</p>
            <p class="text-sm text-slate-600">${item.appointment_time}</p>
          </div>
        `).join('');
      } else {
        scheduleList.innerHTML = '<p class="text-center py-8 text-slate-600">Nenhuma consulta agendada para hoje</p>';
      }

      // Agendamentos pendentes
      const pendingList = document.getElementById('pending-appointments');
      if (pendingAppointments.length > 0) {
        pendingList.innerHTML = pendingAppointments.slice(0, 5).map(item => `
          <div class="p-2 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p class="font-semibold text-sm text-slate-900">${item.pet_name}</p>
            <p class="text-xs text-slate-600">${item.appointment_date}</p>
          </div>
        `).join('');
      } else {
        pendingList.innerHTML = '<p class="text-center py-4 text-slate-500 text-sm">Nenhum pendente</p>';
      }

      // Notificações recentes
      loadRecentNotifications();
    }

    function loadRecentNotifications() {
      const userNotifications = allData.filter(d => d.type === 'notification' && d.veterinarian_id === currentVeterinarian.__backendId).slice(-5);
      const notifList = document.getElementById('recent-notifications');
      
      if (userNotifications.length === 0) {
        notifList.innerHTML = '<p class="text-center py-4 text-slate-500 text-sm">Nenhuma notificação</p>';
      } else {
        notifList.innerHTML = userNotifications.map(n => `
          <div class="p-2 ${n.notification_read !== 'true' ? 'bg-blue-50 border-l-2 border-blue-500' : 'border-l-2 border-slate-200'}">
            <p class="text-sm text-slate-900 font-medium">${n.notification_message}</p>
            <p class="text-xs text-slate-500">${new Date(n.created_at).toLocaleTimeString('pt-BR')}</p>
          </div>
        `).join('');
      }
      lucide.createIcons();
    }

    function updateAllLists() {
      updateAgendaList();
      updatePetsList();
      updateTutoresList();
      updateConsultationsList();
    }

    function updateAgendaList() {
      const list = document.getElementById('agenda-list');
      const agendas = allData.filter(d => d.type === 'agenda' && d.veterinarian_id === currentVeterinarian.__backendId).sort((a, b) => new Date(a.appointment_date) - new Date(b.appointment_date));

      list.innerHTML = agendas.length ? agendas.map(item => {
        const statusColor = item.appointment_status === 'confirmado' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800';
        const statusIcon = item.appointment_status === 'confirmado' ? 'check-circle' : 'clock';
        return `
          <div class="p-4 bg-white rounded-lg border border-slate-200">
            <div class="flex justify-between items-start mb-2">
              <p class="font-semibold text-slate-900">${item.pet_name}</p>
              <span class="px-2 py-1 text-xs font-semibold rounded-full ${statusColor} flex items-center gap-1">
                <i data-lucide="${statusIcon}" style="width: 14px; height: 14px;"></i>
                ${item.appointment_status === 'confirmado' ? 'Confirmado' : 'Pendente'}
              </span>
            </div>
            <p class="text-sm text-slate-600">${item.appointment_date} às ${item.appointment_time}</p>
            <p class="text-xs text-slate-500 mt-2">📞 ${item.tutor_phone || 'Sem telefone'}</p>
            <div class="flex gap-2 mt-3">
              ${item.appointment_status === 'pendente' ? `<button onclick="confirmAppointment('${item.__backendId}')" class="text-xs px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600">Confirmar</button>` : ''}
              ${item.whatsapp_sent !== 'true' ? `<button onclick="sendWhatsappMessage('${item.__backendId}')" class="text-xs px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700">Enviar WhatsApp</button>` : '<span class="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded">✓ WhatsApp enviado</span>'}
            </div>
          </div>
        `;
      }).join('') : '<p class="text-center py-8 text-slate-600">Nenhuma consulta agendada</p>';
      lucide.createIcons();
    }

    function updatePetsList() {
      const list = document.getElementById('pets-list');
      const pets = allData.filter(d => d.type === 'pet' && d.veterinarian_id === currentVeterinarian.__backendId);

      list.innerHTML = pets.length ? pets.map(item => `
        <div class="p-4 bg-white rounded-lg border border-slate-200 flex gap-4">
          <div class="w-16 h-16 flex-shrink-0 bg-slate-200 rounded-lg flex items-center justify-center overflow-hidden">
            ${item.pet_photo ? `<img src="${item.pet_photo}" style="width: 100%; height: 100%; object-fit: cover;">` : `<i data-lucide="${getPetIcon(item.pet_species)}" style="width: 32px; height: 32px; color: #94a3b8;"></i>`}
          </div>
          <div class="flex-1">
            <p class="font-semibold text-slate-900">${item.pet_name}</p>
            <p class="text-sm text-slate-600">${item.pet_species} - ${item.pet_breed}</p>
            <p class="text-xs text-slate-500 mt-1">${item.pet_age} anos | ${item.pet_weight}kg</p>
          </div>
        </div>
      `).join('') : '<p class="text-center py-8 col-span-full text-slate-600">Nenhum pet cadastrado</p>';
      lucide.createIcons();
    }

    function updateTutoresList() {
      const list = document.getElementById('tutores-list');
      const tutores = allData.filter(d => d.type === 'tutor' && d.veterinarian_id === currentVeterinarian.__backendId);

      list.innerHTML = tutores.length ? tutores.map(item => `
        <div class="p-4 bg-white rounded-lg border border-slate-200 flex gap-4">
          <div class="w-16 h-16 flex-shrink-0 bg-slate-200 rounded-lg flex items-center justify-center overflow-hidden">
            ${item.tutor_photo ? `<img src="${item.tutor_photo}" style="width: 100%; height: 100%; object-fit: cover;">` : '<i data-lucide="users" style="width: 32px; height: 32px; color: #94a3b8;"></i>'}
          </div>
          <div class="flex-1">
            <p class="font-semibold text-slate-900">${item.tutor_name}</p>
            <p class="text-sm text-slate-600">${item.tutor_phone}</p>
            <p class="text-xs text-slate-500">${item.tutor_email}</p>
          </div>
        </div>
      `).join('') : '<p class="text-center py-8 col-span-full text-slate-600">Nenhum tutor cadastrado</p>';
      lucide.createIcons();
    }

    function updateConsultationsList() {
      const list = document.getElementById('consultations-list');
      const consultations = allData.filter(d => d.type === 'consultation' && d.veterinarian_id === currentVeterinarian.__backendId);

      list.innerHTML = consultations.length ? consultations.map(item => `
        <div class="p-4 bg-white rounded-lg border border-slate-200">
          <p class="font-semibold text-slate-900">${item.pet_name}</p>
          <p class="text-sm text-slate-600">Diagnóstico: ${item.diagnosis}</p>
        </div>
      `).join('') : '<p class="text-center py-8 text-slate-600">Nenhum prontuário registrado</p>';
    }

    function showAgendaForm() { document.getElementById('agendaForm').classList.remove('hidden'); }
    function hideAgendaForm() { document.getElementById('agendaForm').classList.add('hidden'); }
    function showPetForm() { 
      document.getElementById('petForm').classList.remove('hidden'); 
      petPhotoData = null;
      document.getElementById('pet-photo-preview').innerHTML = '<i data-lucide="dog" style="width: 40px; height: 40px; color: #94a3b8;"></i>';
      lucide.createIcons();
    }
    function hidePetForm() { 
      document.getElementById('petForm').classList.add('hidden'); 
      petPhotoData = null;
    }
    function showTutorForm() { 
      document.getElementById('tutorForm').classList.remove('hidden'); 
      tutorPhotoData = null;
      document.getElementById('tutor-photo-preview').innerHTML = '<i data-lucide="users" style="width: 40px; height: 40px; color: #94a3b8;"></i>';
      lucide.createIcons();
    }
    function hideTutorForm() { 
      document.getElementById('tutorForm').classList.add('hidden'); 
      tutorPhotoData = null;
    }
    function showConsultationForm() { document.getElementById('consultationForm').classList.remove('hidden'); }
    function hideConsultationForm() { document.getElementById('consultationForm').classList.add('hidden'); }

    function updatePetIconPreview() {
      const species = document.getElementById('pet-species').value;
      const preview = document.getElementById('pet-photo-preview');
      if (!petPhotoData && species) {
        preview.innerHTML = `<i data-lucide="${getPetIcon(species)}" style="width: 40px; height: 40px; color: #94a3b8;"></i>`;
        lucide.createIcons();
      }
    }

    async function confirmAppointment(appointmentId) {
      const appointment = allData.find(d => d.__backendId === appointmentId);
      if (!appointment) return;

      const updated = { ...appointment, appointment_status: 'confirmado' };
      const result = await window.dataSdk.update(updated);
      
      if (result.isOk) {
        showMessage('Consulta confirmada!', 'success');
        createNotification(`Consulta de ${appointment.pet_name} confirmada para ${appointment.appointment_date}`);
      }
    }

    async function sendWhatsappMessage(appointmentId) {
      const appointment = allData.find(d => d.__backendId === appointmentId);
      if (!appointment) return;

      const phone = appointment.tutor_phone.replace(/\D/g, '');
      const message = `Olá! Sua consulta com o pet ${appointment.pet_name} foi agendada para ${appointment.appointment_date} às ${appointment.appointment_time}. Por favor, confirme sua presença. Obrigado!`;
      const encodedMessage = encodeURIComponent(message);
      
      window.open(`https://wa.me/55${phone}?text=${encodedMessage}`, '_blank');

      const updated = { ...appointment, whatsapp_sent: 'true' };
      await window.dataSdk.update(updated);
      
      showMessage('Mensagem enviada via WhatsApp!', 'success');
      createNotification(`WhatsApp enviado para ${appointment.pet_name}`);
    }

    async function createNotification(message) {
      await window.dataSdk.create({
        type: 'notification',
        veterinarian_id: currentVeterinarian.__backendId,
        notification_message: message,
        notification_type: 'system',
        notification_read: 'false',
        created_at: new Date().toISOString()
      });
    }

    function handlePetPhotoUpload() {
      const input = document.getElementById('pet-photo-input');
      const file = input.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
          petPhotoData = e.target.result;
          document.getElementById('pet-photo-preview').innerHTML = `<img src="${petPhotoData}" style="width: 100%; height: 100%; object-fit: cover;">`;
        };
        reader.readAsDataURL(file);
      }
    }

    function handleTutorPhotoUpload() {
      const input = document.getElementById('tutor-photo-input');
      const file = input.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
          tutorPhotoData = e.target.result;
          document.getElementById('tutor-photo-preview').innerHTML = `<img src="${tutorPhotoData}" style="width: 100%; height: 100%; object-fit: cover;">`;
        };
        reader.readAsDataURL(file);
      }
    }

    async function saveAgenda() {
      const petName = document.getElementById('agenda-pet').value;
      const tutorName = document.getElementById('agenda-tutor').value;
      const phone = document.getElementById('agenda-phone').value;
      const date = document.getElementById('agenda-date').value;
      const time = document.getElementById('agenda-time').value;
      const status = document.getElementById('agenda-status').value;
      
      if (!petName || !tutorName || !phone || !date || !time) {
        showMessage('Preencha todos os campos', 'error');
        return;
      }

      const result = await window.dataSdk.create({
        type: 'agenda',
        veterinarian_id: currentVeterinarian.__backendId,
        pet_name: petName,
        tutor_phone: phone,
        appointment_date: date,
        appointment_time: time,
        appointment_reason: document.getElementById('agenda-notes').value,
        appointment_status: status,
        whatsapp_sent: 'false',
        created_at: new Date().toISOString()
      });

      if (result.isOk) {
        hideAgendaForm();
        document.getElementById('agenda-pet').value = '';
        document.getElementById('agenda-tutor').value = '';
        document.getElementById('agenda-phone').value = '';
        document.getElementById('agenda-date').value = '';
        document.getElementById('agenda-time').value = '';
        document.getElementById('agenda-status').value = 'pendente';
        document.getElementById('agenda-notes').value = '';
        showMessage('Consulta agendada!', 'success');
      }
    }

    async function savePet() {
      const name = document.getElementById('pet-name').value;
      const species = document.getElementById('pet-species').value;
      
      if (!name || !species) {
        showMessage('Preencha obrigatórios', 'error');
        return;
      }

      const result = await window.dataSdk.create({
        type: 'pet',
        veterinarian_id: currentVeterinarian.__backendId,
        pet_name: name,
        pet_species: species,
        pet_breed: document.getElementById('pet-breed').value,
        pet_age: document.getElementById('pet-age').value,
        pet_weight: document.getElementById('pet-weight').value,
        pet_photo: petPhotoData || '',
        created_at: new Date().toISOString()
      });

      if (result.isOk) {
        hidePetForm();
        document.getElementById('pet-name').value = '';
        document.getElementById('pet-breed').value = '';
        document.getElementById('pet-age').value = '';
        document.getElementById('pet-weight').value = '';
        document.getElementById('pet-species').value = '';
        document.getElementById('pet-photo-input').value = '';
        showMessage('Pet cadastrado!', 'success');
      }
    }

    async function saveTutor() {
      const name = document.getElementById('tutor-name').value;
      if (!name) {
        showMessage('Preencha o nome', 'error');
        return;
      }

      const result = await window.dataSdk.create({
        type: 'tutor',
        veterinarian_id: currentVeterinarian.__backendId,
        tutor_name: name,
        tutor_phone: document.getElementById('tutor-phone').value,
        tutor_email: document.getElementById('tutor-email').value,
        tutor_photo: tutorPhotoData || '',
        created_at: new Date().toISOString()
      });

      if (result.isOk) {
        hideTutorForm();
        document.getElementById('tutor-name').value = '';
        document.getElementById('tutor-phone').value = '';
        document.getElementById('tutor-email').value = '';
        document.getElementById('tutor-photo-input').value = '';
        showMessage('Tutor cadastrado!', 'success');
      }
    }

    async function saveConsultation() {
      const petName = document.getElementById('consultation-pet').value;
      const diagnosis = document.getElementById('consultation-diagnosis').value;
      
      if (!petName || !diagnosis) {
        showMessage('Preencha pet e diagnóstico', 'error');
        return;
      }

      const result = await window.dataSdk.create({
        type: 'consultation',
        veterinarian_id: currentVeterinarian.__backendId,
        pet_name: petName,
        diagnosis: diagnosis,
        prescription: document.getElementById('consultation-prescription').value,
        consultation_notes: document.getElementById('consultation-notes').value,
        created_at: new Date().toISOString()
      });

      if (result.isOk) {
        hideConsultationForm();
        showMessage('Prontuário salvo!', 'success');
      }
    }

    // Fechar dropdown ao clicar fora
    document.addEventListener('click', function(event) {
      const dropdown = document.getElementById('notification-dropdown');
      const bell = document.querySelector('.notification-bell');
      if (!dropdown.contains(event.target) && !bell.contains(event.target)) {
        dropdown.classList.add('hidden');
      }
    });

    window.addEventListener('beforeunload', function() {
      lucide.createIcons();
    });

    initSDK();
  </script>
 <script>(function(){function c(){var b=a.contentDocument||a.contentWindow.document;if(b){var d=b.createElement('script');d.innerHTML="window.__CF$cv$params={r:'9e9c4a90a7465402',t:'MTc3NTc2Njg1My4wMDAwMDA='};var a=document.createElement('script');a.nonce='';a.src='/cdn-cgi/challenge-platform/scripts/jsd/main.js';document.getElementsByTagName('head')[0].appendChild(a);";b.getElementsByTagName('head')[0].appendChild(d)}}if(document.body){var a=document.createElement('iframe');a.height=1;a.width=1;a.style.position='absolute';a.style.top=0;a.style.left=0;a.style.border='none';a.style.visibility='hidden';document.body.appendChild(a);if('loading'!==document.readyState)c();else if(window.addEventListener)document.addEventListener('DOMContentLoaded',c);else{var e=document.onreadystatechange||function(){};document.onreadystatechange=function(b){e(b);'loading'!==document.readyState&&(document.onreadystatechange=e,c())}}}})();</script></body>
</html>