# 🐾 VetCare

O **VetCare** é uma aplicação web para gestão veterinária, desenvolvida para facilitar o controle de **prontuários**, **agendamentos** e informações de pets em um único sistema.

O projeto simula um ambiente real de clínica veterinária, com foco em organização, praticidade e eficiência no acompanhamento dos atendimentos.

---

## 🚀 Funcionalidades

- Cadastro de pets
- Agendamento de consultas
- Registro de prontuários
- Visualização de informações clínicas
- Interface simples e intuitiva
- Login de veterinário
- Rotas protegidas para o sistema
- Rota dinâmica de detalhes de tutor

---

## 🛠️ Tecnologias utilizadas

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- Axios
- js-cookie
- Lucide React

---

## 📁 Estrutura do projeto

```
Vet-Care/
├── Back/
├── app/
├── docs/
├── public/
├── .gitignore
├── README.md
├── next-env.d.ts
├── next.config.ts
├── package-lock.json
├── package.json
├── postcss.config.mjs
├── tailwind.config.ts
└── tsconfig.json
```

---

## ▶️ Como executar o projeto

### Pré-requisitos

- Node.js instalado
- npm ou yarn

### Configuração de ambiente

Crie um arquivo `.env.local` com base no `.env.example`:

```bash
cp .env.example .env.local
```

Variável utilizada:

- `NEXT_PUBLIC_API_URL` (exemplo: `http://localhost:8080`)

### Passos

```bash
git clone https://github.com/BiancaB3/Vet-Care.git
cd Vet-Care/front
npm install
npm run dev
```

A aplicação estará disponível em:

http://localhost:3000

---

## 👩‍💻 Observações

- O projeto possui frontend (Next.js) e backend (Spring Boot) separados.
- O frontend utiliza Context API, rotas dinâmicas, layouts públicos e protegidos, consumo de API com Axios e manipulação de cookies.
- O README reflete a estrutura real do repositório.

🎯 Objetivo do projeto

Este projeto foi desenvolvido com foco em:

Prática de desenvolvimento front-end moderno

Organização e estruturação de código

Simulação de um sistema real

Evolução contínua com novas funcionalidades
