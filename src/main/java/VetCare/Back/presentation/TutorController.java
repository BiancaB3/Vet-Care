package VetCare.Back.presentation;

import VetCare.Back.domain.entities.Tutor;
import VetCare.Back.domain.repository.TutorRepository;
import VetCare.Back.domain.repository.VeterinarioRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

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
    public ResponseEntity<List<Tutor>> listarTodos() {
        var veterinario = obterVeterinarioAutenticado();
        if (veterinario == null) {
            return ResponseEntity.status(401).build();
        }

        return ResponseEntity.ok(tutorRepository.findByVeterinarioId(veterinario.getId()));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Buscar tutor por id", description = "Retorna um tutor pelo identificador informado.")
    public ResponseEntity<Tutor> buscarPorId(@PathVariable Long id) {
        var veterinario = obterVeterinarioAutenticado();
        if (veterinario == null) {
            return ResponseEntity.status(401).build();
        }

        return tutorRepository.findByIdAndVeterinarioId(id, veterinario.getId())
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    @Operation(summary = "Cadastrar tutor", description = "Cadastra um novo tutor no sistema.")
    public ResponseEntity<?> salvar(@RequestBody Tutor tutor) {
        var veterinario = obterVeterinarioAutenticado();
        if (veterinario == null) {
            return ResponseEntity.status(401).body("Veterinario nao autenticado.");
        }

        var validacao = validarTutor(tutor);
        if (validacao != null) {
            return validacao;
        }

        tutor.setVeterinario(veterinario);
        return ResponseEntity.ok(tutorRepository.save(tutor).getId());
    }

    @PutMapping("/{id}")
    @Operation(summary = "Atualizar tutor", description = "Atualiza os dados de um tutor existente.")
    public ResponseEntity<?> atualizar(@PathVariable Long id, @RequestBody Tutor tutor) {
        var veterinario = obterVeterinarioAutenticado();
        if (veterinario == null) {
            return ResponseEntity.status(401).body("Veterinario nao autenticado.");
        }

        var validacao = validarTutor(tutor);
        if (validacao != null) {
            return validacao;
        }

        var tutorBanco = tutorRepository.findByIdAndVeterinarioId(id, veterinario.getId()).orElse(null);
        if (tutorBanco != null) {
            tutorBanco.setNome(tutor.getNome());
            tutorBanco.setCpf(tutor.getCpf());
            tutorBanco.setCep(tutor.getCep());
            tutorBanco.setTelefone(tutor.getTelefone());
            tutorBanco.setEmail(tutor.getEmail());
            tutorBanco.setEndereco(tutor.getEndereco());
            tutorBanco.setStatus(tutor.getStatus());
            tutorRepository.save(tutorBanco);
            return ResponseEntity.ok("Atualizado com sucesso!");
        }
        return ResponseEntity.notFound().build();
    }

    private ResponseEntity<?> validarTutor(Tutor tutor) {
        if (tutor == null) {
            return ResponseEntity.badRequest().body("Dados do tutor nao informados.");
        }

        if (tutor.getNome() == null || tutor.getNome().isBlank()) {
            return ResponseEntity.badRequest().body("Nome do tutor e obrigatorio.");
        }

        if (tutor.getEmail() == null || tutor.getEmail().isBlank()) {
            return ResponseEntity.badRequest().body("Email do tutor e obrigatorio.");
        }

        if (!cpfValido(tutor.getCpf())) {
            return ResponseEntity.badRequest().body("CPF invalido. Informe um CPF valido com 11 digitos.");
        }

        if (!cepValido(tutor.getCep())) {
            return ResponseEntity.badRequest().body("CEP invalido. Informe um CEP valido com 8 digitos.");
        }

        return null;
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

    @DeleteMapping("/{id}")
    @Operation(summary = "Remover tutor", description = "Remove um tutor pelo identificador informado.")
    public ResponseEntity<?> remover(@PathVariable Long id) {
        var veterinario = obterVeterinarioAutenticado();
        if (veterinario == null) {
            return ResponseEntity.status(401).body("Veterinario nao autenticado.");
        }

        if (!tutorRepository.existsByIdAndVeterinarioId(id, veterinario.getId())) {
            return ResponseEntity.notFound().build();
        }

        tutorRepository.deleteById(id);
        return ResponseEntity.ok("Removido com sucesso!");
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