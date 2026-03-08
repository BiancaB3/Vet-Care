# VetCare — Manual do usuário

Este documento descreve como usar o **VetCare** do ponto de vista de quem utiliza o sistema no dia a dia: o **veterinário**.

---

## O que é o VetCare?

O VetCare é um sistema de gestão para clínicas veterinárias. Ele permite:

- Controlar **prontuários** (tutores, pets e consultas)
- Ver e organizar a **agenda de consultas**
- Registrar **diagnóstico e prescrição** de cada atendimento
- Simular o envio de um **resumo/receita por e-mail** ao tutor ao finalizar a consulta

O sistema é **por profissional**: cada veterinário logado enxerga apenas **seus próprios** tutores, pets e consultas. Os dados de um veterinário não aparecem para outro.

---

## Acesso ao sistema

### Tela de login

1. Abra o sistema no navegador (o endereço é informado pela clínica ou equipe de TI).
2. Na tela inicial você verá o logo do VetCare e o formulário de **Entrar**.
3. Informe seu **e-mail** e **senha** de acesso.
4. Clique em **Entrar**.

- Se e-mail ou senha estiverem incorretos, uma mensagem em vermelho aparecerá: _"E-mail ou senha incorretos. Tente novamente."_
- Se os dados estiverem corretos, você será levado à tela **Início** (home).

Enquanto estiver logado, se você tentar acessar a tela de login de novo, o sistema pode redirecioná-lo automaticamente para o Início.

### Logins já criados

Para uso em desenvolvimento ou demonstração, o sistema já possui os seguintes usuários cadastrados:

| Nome              | E-mail              | Senha  | CRMV          |
| ----------------- | ------------------- | ------ | ------------- |
| Dr. Ricardo Silva | ricardo@vetcare.com | 123456 | CRMV-SP 12345 |
| Dra. Maria Santos | maria@vetcare.com   | 123456 | CRMV-SP 67890 |

Use qualquer um desses pares de **e-mail** e **senha** para entrar no sistema. Cada veterinário enxerga apenas sua própria base de tutores, pets e consultas.

### Sair do sistema

No canto superior direito da tela (no cabeçalho), clique no botão **Sair**. Você será deslogado e voltará à tela de login.

---

## Navegação

A interface é dividida em **cabeçalho** e **barra lateral**:

### Cabeçalho (topo)

- **VetCare** (com logo) — seu nome e CRMV aparecem aqui.

### Barra lateral (esquerda)

Na sidebar você encontra as principais seções:

- **Prontuários** — histórico de consultas realizadas com diagnóstico e prescrição.

## Dashboard/Resumo

- **Pets** — quantidade total de pets cadastrados.

## Seção: Agenda

### Listagem de consultas

- Horário
- Nome do pet

- Acima da lista há:
  - um campo de **busca** para filtrar por nome do pet
  - um menu suspenso para filtrar por **status** (Todos, Agendado, Concluído, Cancelado)

### Ações

- Clicando em um card de consulta, você pode **editar** ou **deletar** a consulta.
- No topo há o botão **+ Nova Consulta**, que abre o formulário para agendar uma nova consulta.

### Formulário de agendamento

Ao criar uma nova consulta:

- Escolha o pet
- Informe a **data** e **hora**
- Descreva o **motivo da consulta**
- Clique em **Agendar**

---

## Seção: Tutores

Na tela **Tutores** você gerencia todos os tutores (responsáveis pelos pets).

### Listagem de tutores

- Aparecem todos os tutores que **você** cadastrou, com:
  - Nome completo
  - E-mail
  - Telefone

- No topo há um campo de **busca** para filtrar por nome do tutor

### Ações

- Clique no botão **+ Novo Tutor** para cadastrar um novo tutor.
- Preencha nome, e-mail e telefone.
- Clique em **Salvar**.

Cada tutor pertence apenas ao veterinário que o cadastrou.

---

## Seção: Pets

Na tela **Pets** você gerencia todos os pacientes (pets) da sua clínica.

### Listagem de pets

- Aparecem todos os pets que **você** cadastrou, com:
  - Nome do pet
  - Espécie (Cão, Gato, Ave, Roedor, Réptil)
  - Raça
  - Nome do tutor responsável

- No topo há um campo de **busca** para filtrar por nome do pet

### Ações

- Clique no botão **+ Novo Pet** para cadastrar um novo pet.
- Preencha:
  - Nome do pet
  - Espécie
  - Raça
  - Selecione o **tutor** responsável (deve estar cadastrado antes)
- Clique em **Salvar**.

Cada pet está vinculado a um tutor e só é visível para o veterinário que o cadastrou.

---

## Seção: Prontuários

Na tela **Prontuários** você vê o histórico de todas as consultas realizadas.

### Listagem de prontuários

- Cada consulta mostra:
  - Nome do pet
  - Data e hora da consulta
  - Motivo da consulta
  - Diagnóstico (se registrado)
  - Prescrição (se registrada)

- No topo há um campo de **busca** para filtrar por nome do pet

### Ações

- Clique no botão **+ Nova Consulta** para registrar uma nova consulta.
- Clique no ícone **Editar** para alterar uma consulta existente.
- Clique no ícone **Lixeira** para deletar uma consulta.

### Formulário de consulta

Ao registrar uma consulta:

- Escolha o **pet** atendido. Só aparecem pets do seu cadastro.
- Selecione a **data** e **hora** da consulta.
- Descreva o **motivo** da consulta.
- Informe o **diagnóstico** (texto livre).
- Informe a **prescrição/receita** com medicamentos e orientações.
- Adicione **observações** (campo opcional).
- Clique em **Registrar** ou **Atualizar** (se editar).

Os dados ficam armazenados durante sua sessão no sistema. Se você sair e fizer login novamente, os dados serão preservados.

---

## Regras importantes

1. **Dados por veterinário**  
   Tutores, pets e consultas são separados por profissional. Você só vê e só altera o que é seu. Outro veterinário logado no sistema vê apenas sua própria base de dados.

2. **Gerenciamento de dados**  
   Os dados são gerenciados pelo Context API do React durante sua sessão. Ao deslogar e logar novamente, seus dados são mantidos em memória conforme gerenciado pelo sistema.

3. **Segurança**  
   Cada veterinário acessa o sistema com seu próprio e-mail e senha. Dados de um profissional nunca são visíveis para outro.

---

## Resumo do fluxo típico

1. **Entrar** com e-mail e senha (use as credenciais fornecidas).
2. **Cadastrar tutores** na seção **Tutores** usando o botão **+ Novo Tutor**.
3. **Cadastrar pets** na seção **Pets** usando o botão **+ Novo Pet**, vinculando cada um a um tutor já cadastrado.
4. **Agendar consultas** na seção **Agenda** usando o botão **+ Nova Consulta**, informando pet, data, hora e motivo.
5. **Registrar detalhes da consulta** na seção **Prontuários** usando o botão **+ Nova Consulta**, preenchendo diagnóstico e prescrição.
6. **Consultar histórico** sempre que precisar na seção **Prontuários** para ver todas as consultas realizadas.
7. **Editar ou deletar** consultas conforme necessário usando os botões de ação em cada seção.
8. **Sair** ao terminar o uso, clicando no botão **Sair** no cabeçalho.

---

_Documento gerado para o projeto VetCare — Sistema de Gestão para Clínicas Veterinárias._
