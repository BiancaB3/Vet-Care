-- =====================================================
-- VET-CARE DATABASE SCHEMA
-- Database: vetcare_back
-- PostgreSQL
-- =====================================================

-- Tabela: Veterinarios
-- Armazena dados dos profissionais veterinários
CREATE TABLE IF NOT EXISTS veterinarios (
    id BIGSERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    crmv VARCHAR(20) NOT NULL UNIQUE,
    especialidade VARCHAR(100),
    telefone VARCHAR(20),
    email VARCHAR(100) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela: Tutores
-- Armazena dados dos donos/responsáveis pelos pets
CREATE TABLE IF NOT EXISTS tutores (
    id BIGSERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    cpf VARCHAR(14) NOT NULL UNIQUE,
    telefone VARCHAR(20),
    email VARCHAR(100) NOT NULL UNIQUE,
    endereco VARCHAR(500),
    status VARCHAR(20) DEFAULT 'ATIVO' CHECK (status IN ('ATIVO', 'INATIVO')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela: Pets
-- Armazena dados dos animais de estimação
CREATE TABLE IF NOT EXISTS pets (
    id BIGSERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    especie VARCHAR(50) NOT NULL,
    raca VARCHAR(100),
    idade INTEGER,
    peso DECIMAL(10, 2),
    sexo VARCHAR(20) CHECK (sexo IN ('MACHO', 'FEMEA', 'NAO_INFORMADO')),
    cor VARCHAR(100),
    tutor_id BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tutor_id) REFERENCES tutores(id) ON DELETE CASCADE
);

-- Tabela: Agendamentos
-- Armazena agendamentos de consultas/atendimentos
CREATE TABLE IF NOT EXISTS agendamentos (
    id BIGSERIAL PRIMARY KEY,
    pet_id BIGINT NOT NULL,
    veterinario_id BIGINT NOT NULL,
    data_hora TIMESTAMP NOT NULL,
    observacoes VARCHAR(1000),
    status VARCHAR(20) DEFAULT 'AGENDADO' CHECK (status IN ('AGENDADO', 'CONFIRMADO', 'CANCELADO', 'REALIZADO')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (pet_id) REFERENCES pets(id) ON DELETE CASCADE,
    FOREIGN KEY (veterinario_id) REFERENCES veterinarios(id) ON DELETE CASCADE
);

-- Tabela: Prontuarios
-- Armazena histórico médico/prontuários dos pets
CREATE TABLE IF NOT EXISTS prontuarios (
    id BIGSERIAL PRIMARY KEY,
    pet_id BIGINT NOT NULL,
    veterinario_id BIGINT NOT NULL,
    agendamento_id BIGINT,
    data_atendimento TIMESTAMP NOT NULL,
    descricao TEXT,
    diagnostico TEXT,
    tratamento TEXT,
    prescricao TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (pet_id) REFERENCES pets(id) ON DELETE CASCADE,
    FOREIGN KEY (veterinario_id) REFERENCES veterinarios(id) ON DELETE CASCADE,
    FOREIGN KEY (agendamento_id) REFERENCES agendamentos(id) ON DELETE SET NULL
);

-- Tabela: Token
-- Armazena tokens JWT dos usuários
CREATE TABLE IF NOT EXISTS token (
    id BIGSERIAL PRIMARY KEY,
    token TEXT NOT NULL UNIQUE,
    veterinario_id BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP,
    FOREIGN KEY (veterinario_id) REFERENCES veterinarios(id) ON DELETE CASCADE
);

-- =====================================================
-- INDEXES (Para melhorar performance de consultas)
-- =====================================================

-- Índices em Tutores
CREATE INDEX idx_tutores_cpf ON tutores(cpf);
CREATE INDEX idx_tutores_email ON tutores(email);
CREATE INDEX idx_tutores_status ON tutores(status);

-- Índices em Pets
CREATE INDEX idx_pets_tutor_id ON pets(tutor_id);
CREATE INDEX idx_pets_especie ON pets(especie);
CREATE INDEX idx_pets_raca ON pets(raca);

-- Índices em Agendamentos
CREATE INDEX idx_agendamentos_pet_id ON agendamentos(pet_id);
CREATE INDEX idx_agendamentos_veterinario_id ON agendamentos(veterinario_id);
CREATE INDEX idx_agendamentos_data_hora ON agendamentos(data_hora);
CREATE INDEX idx_agendamentos_status ON agendamentos(status);

-- Índices em Prontuarios
CREATE INDEX idx_prontuarios_pet_id ON prontuarios(pet_id);
CREATE INDEX idx_prontuarios_veterinario_id ON prontuarios(veterinario_id);
CREATE INDEX idx_prontuarios_agendamento_id ON prontuarios(agendamento_id);
CREATE INDEX idx_prontuarios_data_atendimento ON prontuarios(data_atendimento);

-- Índices em Token
CREATE INDEX idx_token_veterinario_id ON token(veterinario_id);
CREATE INDEX idx_token_token ON token(token);

-- Índices em Veterinarios
CREATE INDEX idx_veterinarios_crmv ON veterinarios(crmv);
CREATE INDEX idx_veterinarios_email ON veterinarios(email);

-- =====================================================
-- COMENTÁRIOS DAS TABELAS
-- =====================================================

COMMENT ON TABLE veterinarios IS 'Armazena informações dos profissionais veterinários cadastrados no sistema';
COMMENT ON TABLE tutores IS 'Armazena informações dos donos/responsáveis pelos pets';
COMMENT ON TABLE pets IS 'Armazena informações dos animais de estimação registrados no sistema';
COMMENT ON TABLE agendamentos IS 'Armazena agendamentos de consultas e atendimentos veterinários';
COMMENT ON TABLE prontuarios IS 'Armazena histórico médico e prontuários dos animais atendidos';
COMMENT ON TABLE token IS 'Armazena tokens JWT para autenticação de usuários (veterinários)';
