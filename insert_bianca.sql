-- =====================================================
-- INSERT VETERINÁRIA BIANCA - VET-CARE
-- =====================================================

INSERT INTO veterinarios (nome, crmv, especialidade, telefone, email, senha)
VALUES ('Bianca', '98765/SP', 'Clínica Geral', '(11) 99999-8888', 'bianca@vetcare.com', '123456');

-- Inserir também um Tutor e um Pet de teste para ter dados
INSERT INTO tutores (nome, cpf, telefone, email, endereco, status)
VALUES ('João Silva', '11111111111', '(11) 91234-5678', 'joao@example.com', 'Rua Principal, 100 - São Paulo', 'ATIVO');

INSERT INTO pets (nome, especie, raca, idade, peso, sexo, cor, tutor_id)
VALUES ('Max', 'Cachorro', 'Labrador', 5, 32.0, 'MACHO', 'Preto', 1);
