package VetCare.Back.presentation;

import VetCare.Back.application.DTO.TutorRequest;
import VetCare.Back.application.DTO.TutorResponse;
import VetCare.Back.domain.enuns.EnumStatusTutor;
import VetCare.Back.domain.entities.Tutor;
import VetCare.Back.domain.repository.TutorRepository;
import VetCare.Back.domain.repository.VeterinarioRepository;
import jakarta.validation.Valid;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Locale;

@RestController
@RequestMapping("/tutores")
@Tag(name = "Tutores", description = "Endpoints para gerenciamento dos tutores do VetCare.")
public class TutorController {

    @Autowired
    private TutorRepository tutorRepository;

    @Autowired
    private VeterinarioRepository veterinarioRepository;

    @GetMapping
    @Operation(summary = "Listar tutores", description = "Retorna a lista de tutores cadastrados.")
    public ResponseEntity<List<TutorResponse>> listarTodos() {
        var veterinario = obterVeterinarioAutenticado();
        if (veterinario == null) {
            return ResponseEntity.status(401).build();
        }

        var resposta = tutorRepository.findByVeterinarioId(veterinario.getId())
                .stream()
                .map(this::toResponse)
                .toList();

        return ResponseEntity.ok(resposta);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Buscar tutor por id", description = "Retorna um tutor pelo identificador informado.")
    public ResponseEntity<TutorResponse> buscarPorId(@PathVariable Long id) {
        var veterinario = obterVeterinarioAutenticado();
        if (veterinario == null) {
            return ResponseEntity.status(401).build();
        }

        return tutorRepository.findByIdAndVeterinarioId(id, veterinario.getId())
                .map(this::toResponse)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    @Operation(summary = "Cadastrar tutor", description = "Cadastra um novo tutor no sistema.")
    public ResponseEntity<?> salvar(@Valid @RequestBody TutorRequest tutorRequest) {
        var veterinario = obterVeterinarioAutenticado();
        if (veterinario == null) {
            return ResponseEntity.status(401).body("Veterinario nao autenticado.");
        }

        var validacao = validarTutor(tutorRequest);
        if (validacao != null) {
            return validacao;
        }

        var tutor = toEntity(tutorRequest);
        tutor.setVeterinario(veterinario);
        return ResponseEntity.ok(tutorRepository.save(tutor).getId());
    }

    @PutMapping("/{id}")
    @Operation(summary = "Atualizar tutor", description = "Atualiza os dados de um tutor existente.")
    public ResponseEntity<?> atualizar(@PathVariable Long id, @Valid @RequestBody TutorRequest tutorRequest) {
        var veterinario = obterVeterinarioAutenticado();
        if (veterinario == null) {
            return ResponseEntity.status(401).body("Veterinario nao autenticado.");
        }

        var validacao = validarTutor(tutorRequest);
        if (validacao != null) {
            return validacao;
        }

        var tutorAtualizado = toEntity(tutorRequest);
        var tutorBanco = tutorRepository.findByIdAndVeterinarioId(id, veterinario.getId()).orElse(null);
        if (tutorBanco != null) {
            tutorBanco.setNome(tutorAtualizado.getNome());
            tutorBanco.setCpf(tutorAtualizado.getCpf());
            tutorBanco.setCep(tutorAtualizado.getCep());
            tutorBanco.setTelefone(tutorAtualizado.getTelefone());
            tutorBanco.setEmail(tutorAtualizado.getEmail());
            tutorBanco.setEndereco(tutorAtualizado.getEndereco());
            tutorBanco.setStatus(tutorAtualizado.getStatus());
            tutorRepository.save(tutorBanco);
            return ResponseEntity.ok("Atualizado com sucesso!");
        }
        return ResponseEntity.notFound().build();
    }

    private ResponseEntity<?> validarTutor(TutorRequest tutorRequest) {
        if (tutorRequest == null) {
            return ResponseEntity.badRequest().body("Dados do tutor nao informados.");
        }

        if (tutorRequest.nome() == null || tutorRequest.nome().isBlank()) {
            return ResponseEntity.badRequest().body("Nome do tutor e obrigatorio.");
        }

        if (tutorRequest.email() == null || tutorRequest.email().isBlank()) {
            return ResponseEntity.badRequest().body("Email do tutor e obrigatorio.");
        }

        if (!cpfValido(tutorRequest.cpf())) {
            return ResponseEntity.badRequest().body("CPF invalido. Informe um CPF valido com 11 digitos.");
        }

        if (!cepValido(tutorRequest.cep())) {
            return ResponseEntity.badRequest().body("CEP invalido. Informe um CEP valido com 8 digitos.");
        }

        return null;
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

    private VetCare.Back.domain.entities.Veterinario obterVeterinarioAutenticado() {
        Authentication authentication = org.springframework.security.core.context.SecurityContextHolder
                .getContext()
                .getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()) {
            return null;
        }

        var principal = authentication.getPrincipal();
        if (principal instanceof VetCare.Back.domain.entities.Veterinario veterinario) {
            return veterinario;
        }

        return veterinarioRepository.findByEmail(authentication.getName()).orElse(null);
    }
}