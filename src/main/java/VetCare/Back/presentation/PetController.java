package VetCare.Back.presentation;

import VetCare.Back.application.DTO.PetRequest;
import VetCare.Back.application.DTO.PetResponse;
import VetCare.Back.application.services.PetService;
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
@RequestMapping("/pets")
@Tag(name = "Pets", description = "Endpoints para gerenciamento dos pets do VetCare.")
public class PetController {

    @Autowired
    private PetService petService;

    @GetMapping
    @Operation(summary = "Listar pets", description = "Retorna a lista de pets cadastrados.")
    public ResponseEntity<List<PetResponse>> listarTodos(Authentication auth) {
        Veterinario veterinario = (Veterinario) auth.getPrincipal();

        return ResponseEntity.ok(petService.listarTodosResponse(veterinario.getId()));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Buscar pet por id", description = "Retorna um pet pelo identificador informado.")
    public ResponseEntity<PetResponse> buscarPorId(@PathVariable Long id, Authentication auth) {
        Veterinario veterinario = (Veterinario) auth.getPrincipal();

        return ResponseEntity.ok(petService.buscarPorIdResponse(id, veterinario.getId()));
    }

    @PostMapping
    @Operation(summary = "Cadastrar pet", description = "Cadastra um novo pet no sistema.")
    public ResponseEntity<PetResponse> salvar(@RequestBody PetRequest petRequest, Authentication auth) {
        Veterinario veterinario = (Veterinario) auth.getPrincipal();

        return ResponseEntity.status(HttpStatus.CREATED).body(petService.salvar(petRequest, veterinario));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Atualizar pet", description = "Atualiza os dados de um pet existente.")
    public ResponseEntity<?> atualizar(@PathVariable Long id, @RequestBody PetRequest petRequest, Authentication auth) {
        Veterinario veterinario = (Veterinario) auth.getPrincipal();

        petService.atualizar(id, petRequest, veterinario);
        return ResponseEntity.ok().build();
    }
}