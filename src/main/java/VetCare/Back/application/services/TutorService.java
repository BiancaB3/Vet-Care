package VetCare.Back.application.services;

import VetCare.Back.application.DTO.TutorRequest;
import VetCare.Back.application.DTO.TutorResponse;
import VetCare.Back.domain.entities.Tutor;
import VetCare.Back.domain.entities.Veterinario;
import VetCare.Back.domain.enuns.EnumStatusTutor;
import VetCare.Back.domain.repository.TutorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Locale;
import java.util.Optional;

@Service
public class TutorService {

    @Autowired
    private TutorRepository tutorRepository;

    public List<Tutor> listarTodos(Long veterinarioId) {
        return tutorRepository.findByVeterinarioId(veterinarioId);
    }

    public List<TutorResponse> listarTodosResponse(Long veterinarioId) {
        return listarTodos(veterinarioId).stream()
                .map(this::toResponse)
                .toList();
    }

    public Optional<Tutor> buscarPorId(Long id, Long veterinarioId) {
        return tutorRepository.findByIdAndVeterinarioId(id, veterinarioId);
    }

    public TutorResponse buscarPorIdResponse(Long id, Long veterinarioId) {
        return buscarPorId(id, veterinarioId)
                .map(this::toResponse)
                .orElse(null);
    }

    public TutorResponse salvar(TutorRequest tutorRequest, Veterinario veterinario) {
        validarTutor(tutorRequest);

        var tutor = toEntity(tutorRequest);
        tutor.setVeterinario(veterinario);
        return toResponse(tutorRepository.save(tutor));
    }

    public boolean atualizar(Long id, TutorRequest tutorRequest, Veterinario veterinario) {
        validarTutor(tutorRequest);

        var tutorBanco = tutorRepository.findByIdAndVeterinarioId(id, veterinario.getId()).orElse(null);
        if (tutorBanco != null) {
            var tutorAtualizado = toEntity(tutorRequest);
            tutorBanco.setNome(tutorAtualizado.getNome());
            tutorBanco.setCpf(tutorAtualizado.getCpf());
            tutorBanco.setCep(tutorAtualizado.getCep());
            tutorBanco.setTelefone(tutorAtualizado.getTelefone());
            tutorBanco.setEmail(tutorAtualizado.getEmail());
            tutorBanco.setEndereco(tutorAtualizado.getEndereco());
            tutorBanco.setStatus(tutorAtualizado.getStatus());
            tutorRepository.save(tutorBanco);
            return true;
        }

        return false;
    }

    private void validarTutor(TutorRequest tutorRequest) {
        if (tutorRequest == null) {
            throw new IllegalArgumentException("Dados do tutor nao informados.");
        }

        if (tutorRequest.nome() == null || tutorRequest.nome().isBlank()) {
            throw new IllegalArgumentException("Nome do tutor e obrigatorio.");
        }

        if (tutorRequest.email() == null || tutorRequest.email().isBlank()) {
            throw new IllegalArgumentException("Email do tutor e obrigatorio.");
        }

        if (!cpfValido(tutorRequest.cpf())) {
            throw new IllegalArgumentException("CPF invalido. Informe um CPF valido com 11 digitos.");
        }

        if (!cepValido(tutorRequest.cep())) {
            throw new IllegalArgumentException("CEP invalido. Informe um CEP valido com 8 digitos.");
        }
    }

    private Tutor toEntity(TutorRequest request) {
        var tutor = new Tutor();
        tutor.setNome(request.nome().trim());
        tutor.setEmail(request.email().trim());
        tutor.setTelefone(request.telefone().trim());
        tutor.setCpf(request.cpf().replaceAll("\\D", ""));
        tutor.setCep(request.cep().replaceAll("\\D", ""));
        tutor.setEndereco(request.endereco());

        var statusTexto = request.status() == null || request.status().isBlank()
                ? EnumStatusTutor.ATIVO.name()
                : request.status().trim().toUpperCase(Locale.ROOT);
        tutor.setStatus(EnumStatusTutor.valueOf(statusTexto));
        return tutor;
    }

    private TutorResponse toResponse(Tutor tutor) {
        return new TutorResponse(
                tutor.getId(),
                tutor.getNome(),
                tutor.getEmail(),
                tutor.getTelefone(),
                tutor.getCpf(),
                tutor.getCep(),
                tutor.getEndereco(),
                tutor.getStatus() != null ? tutor.getStatus().name() : null
        );
    }

    private boolean cpfValido(String cpf) {
        if (cpf == null) {
            return false;
        }

        String cpfNormalizado = cpf.replaceAll("\\D", "");
        if (!cpfNormalizado.matches("\\d{11}") || cpfNormalizado.matches("(\\d)\\1{10}")) {
            return false;
        }

        int soma = 0;
        for (int i = 0; i < 9; i++) {
            soma += Character.getNumericValue(cpfNormalizado.charAt(i)) * (10 - i);
        }
        int resto = (soma * 10) % 11;
        if (resto == 10) {
            resto = 0;
        }
        if (resto != Character.getNumericValue(cpfNormalizado.charAt(9))) {
            return false;
        }

        soma = 0;
        for (int i = 0; i < 10; i++) {
            soma += Character.getNumericValue(cpfNormalizado.charAt(i)) * (11 - i);
        }
        resto = (soma * 10) % 11;
        if (resto == 10) {
            resto = 0;
        }

        return resto == Character.getNumericValue(cpfNormalizado.charAt(10));
    }

    private boolean cepValido(String cep) {
        if (cep == null) {
            return false;
        }

        return cep.replaceAll("\\D", "").matches("\\d{8}");
    }
}