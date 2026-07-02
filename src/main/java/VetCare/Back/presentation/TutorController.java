package VetCare.Back.presentation;

import VetCare.Back.application.DTO.TutorRequest;
import VetCare.Back.application.DTO.TutorResponse;
import VetCare.Back.application.services.TutorService;
import VetCare.Back.domain.entities.Veterinario;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/tutores")
@Tag(name = "Tutores", description = "Endpoints para gerenciamento dos tutores do VetCare.")
public class TutorController {

    @Autowired
    private TutorService tutorService;

    @GetMapping
    @Operation(summary = "Listar tutores", description = "Retorna a lista de tutores cadastrados.")
    public ResponseEntity<List<TutorResponse>> listarTodos(Authentication auth) {
        Veterinario veterinario = (Veterinario) auth.getPrincipal();

        return ResponseEntity.ok(tutorService.listarTodosResponse(veterinario.getId()));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Buscar tutor por id", description = "Retorna um tutor pelo identificador informado.")
    public ResponseEntity<TutorResponse> buscarPorId(@PathVariable Long id, Authentication auth) {
        Veterinario veterinario = (Veterinario) auth.getPrincipal();

        return ResponseEntity.ok(tutorService.buscarPorIdResponse(id, veterinario.getId()));
    }

    @PostMapping
    @Operation(summary = "Cadastrar tutor", description = "Cadastra um novo tutor no sistema.")
    public ResponseEntity<TutorResponse> salvar(@RequestBody TutorRequest tutorRequest, Authentication auth) {
        Veterinario veterinario = (Veterinario) auth.getPrincipal();

        return ResponseEntity.status(HttpStatus.CREATED).body(tutorService.salvar(tutorRequest, veterinario));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Atualizar tutor", description = "Atualiza os dados de um tutor existente.")
    public ResponseEntity<?> atualizar(@PathVariable Long id, @RequestBody TutorRequest tutorRequest, Authentication auth) {
        Veterinario veterinario = (Veterinario) auth.getPrincipal();

        tutorService.atualizar(id, tutorRequest, veterinario);
        return ResponseEntity.ok().build();
    }
}