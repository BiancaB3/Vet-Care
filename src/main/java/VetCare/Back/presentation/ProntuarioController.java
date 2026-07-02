package VetCare.Back.presentation;

import VetCare.Back.application.DTO.ProntuarioRequest;
import VetCare.Back.application.DTO.ProntuarioResponse;
import VetCare.Back.application.services.ProntuarioService;
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
@RequestMapping("/prontuarios")
@Tag(name = "Prontuarios", description = "Endpoints para gerenciamento dos prontuarios do VetCare.")
public class ProntuarioController {

    @Autowired
    private ProntuarioService prontuarioService;

    @GetMapping
    @Operation(summary = "Listar prontuarios", description = "Retorna a lista de prontuarios cadastrados.")
    public ResponseEntity<List<ProntuarioResponse>> listarTodos(Authentication auth) {
        Veterinario veterinario = (Veterinario) auth.getPrincipal();

        return ResponseEntity.ok(prontuarioService.listarTodosResponse(veterinario.getId()));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Buscar prontuario por id", description = "Retorna um prontuario pelo identificador informado.")
    public ResponseEntity<ProntuarioResponse> buscarPorId(@PathVariable Long id, Authentication auth) {
        Veterinario veterinario = (Veterinario) auth.getPrincipal();

        return ResponseEntity.ok(prontuarioService.buscarPorIdResponse(id, veterinario.getId()));
    }

    @PostMapping
    @Operation(summary = "Cadastrar prontuario", description = "Cadastra um novo prontuario no sistema.")
    public ResponseEntity<ProntuarioResponse> salvar(@RequestBody ProntuarioRequest prontuarioRequest, Authentication auth) {
        Veterinario veterinario = (Veterinario) auth.getPrincipal();

        return ResponseEntity.status(HttpStatus.CREATED).body(prontuarioService.salvar(prontuarioRequest, veterinario));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Atualizar prontuario", description = "Atualiza os dados de um prontuario existente.")
    public ResponseEntity<?> atualizar(@PathVariable Long id, @RequestBody ProntuarioRequest prontuarioRequest, Authentication auth) {
        Veterinario veterinario = (Veterinario) auth.getPrincipal();

        var alterarProntuarioResult = prontuarioService.atualizar(id, prontuarioRequest, veterinario);
        return alterarProntuarioResult ? ResponseEntity.ok("Atualizado com sucesso!") : ResponseEntity.notFound().build();
    }
}

