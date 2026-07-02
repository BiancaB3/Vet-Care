package VetCare.Back.presentation;

import VetCare.Back.application.DTO.TutorRequest;
import VetCare.Back.application.DTO.TutorResponse;
import VetCare.Back.application.services.TutorService;
import VetCare.Back.domain.entities.Veterinario;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/tutores")
@Tag(name = "Tutores", description = "Endpoints para gerenciamento dos tutores do VetCare.")
public class TutorController {

    @Autowired
    private TutorService tutorService;

    @GetMapping
    @Operation(summary = "Listar tutores", description = "Retorna a lista de tutores cadastrados.")
    public ResponseEntity<List<TutorResponse>> listarTodos(@AuthenticationPrincipal Veterinario veterinario) {
        Veterinario vet = requireVeterinario(veterinario);

        return ResponseEntity.ok(tutorService.listarTodosResponse(vet.getId()));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Buscar tutor por id", description = "Retorna um tutor pelo identificador informado.")
    public ResponseEntity<TutorResponse> buscarPorId(@PathVariable Long id, @AuthenticationPrincipal Veterinario veterinario) {
        Veterinario vet = requireVeterinario(veterinario);

        return ResponseEntity.ok(tutorService.buscarPorIdResponse(id, vet.getId()));
    }

    @PostMapping
    @Operation(summary = "Cadastrar tutor", description = "Cadastra um novo tutor no sistema.")
    public ResponseEntity<TutorResponse> salvar(@Valid @RequestBody TutorRequest tutorRequest, @AuthenticationPrincipal Veterinario veterinario) {
        Veterinario vet = requireVeterinario(veterinario);

        return ResponseEntity.status(HttpStatus.CREATED).body(tutorService.salvar(tutorRequest, vet));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Atualizar tutor", description = "Atualiza os dados de um tutor existente.")
    public ResponseEntity<?> atualizar(@PathVariable Long id, @Valid @RequestBody TutorRequest tutorRequest, @AuthenticationPrincipal Veterinario veterinario) {
        Veterinario vet = requireVeterinario(veterinario);

        var alterarTutorResult = tutorService.atualizar(id, tutorRequest, vet);
        return alterarTutorResult ? ResponseEntity.ok("Atualizado com sucesso!") : ResponseEntity.notFound().build();
    }

    private Veterinario requireVeterinario(Veterinario veterinario) {
        if (veterinario == null || veterinario.getId() == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Veterinario nao autenticado.");
        }

        return veterinario;
    }
}