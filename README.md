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
- Lucide React
- Axios
- js-cookie

---

## 📁 Estrutura do projeto

```
Vet-Care/
├── app/
│   ├── (sistema)/
│   │   ├── agendamentos/
│   │   ├── pets/
│   │   ├── tutores/
│   │   │   └── [id]/
│   │   ├── veterinarios/
│   │   └── layout.tsx
│   ├── components/
│   ├── context/
│   ├── login/
│   ├── page.tsx
│   └── publicLayout.tsx
├── Back/           # Backend (Spring Boot)
├── docs/
├── lib/
├── public/
├── README.md
└── package.json
```

---

## ▶️ Como executar o projeto

### Pré-requisitos
- Node.js instalado
- npm ou yarn

### Passos
```bash
git clone https://github.com/BiancaB3/Vet-Care.git
cd Vet-Care
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

🧪 Testes e Qualidade

Testes manuais para validação das funcionalidades

Testes exploratórios para identificação de falhas

Validação dos fluxos principais do sistema

📌 Melhorias futuras

Autenticação de usuários

Cadastro de tutores

Histórico completo de atendimentos

Integração com banco de dados

Responsividade aprimorada

Implementação de testes automatizados

👩‍💻 Autora

Bianca Bez Birolo

Estudante de Análise e Desenvolvimento de Sistemas
Atuação em QA (testes manuais, exploratórios e API)
Em constante evolução na área de tecnologia
