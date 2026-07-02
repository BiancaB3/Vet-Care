package VetCare.Back.presentation;

import VetCare.Back.application.DTO.VeterinarioCadastroRequest;
import VetCare.Back.application.DTO.VeterinarioResponse;
import VetCare.Back.application.DTO.VeterinarioUpdateRequest;
import VetCare.Back.application.services.VeterinarioService;
import jakarta.validation.Valid;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/veterinarios")
@Tag(name = "Veterinarios", description = "Endpoints para gerenciamento dos veterinarios do VetCare.")
public class VeterinarioController {

    @Autowired
    private VeterinarioService veterinarioService;

    @GetMapping
    @Operation(summary = "Listar veterinarios", description = "Retorna a lista de veterinarios cadastrados.")
    public ResponseEntity<List<VeterinarioResponse>> listarTodos() {
        return ResponseEntity.ok(veterinarioService.listarTodos());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Buscar veterinario por id", description = "Retorna um veterinario pelo identificador informado.")
    public ResponseEntity<VeterinarioResponse> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(veterinarioService.buscarPorId(id));
    }

    @GetMapping("/logado")
    @Operation(summary = "Buscar veterinario logado", description = "Retorna os dados do veterinario autenticado.")
    public ResponseEntity<VeterinarioResponse> buscarLogado(Authentication authentication) {
        String email = requireEmail(authentication);
        VeterinarioResponse veterinario = veterinarioService.buscarPorEmail(email);

        if (veterinario == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Veterinario nao autenticado.");
        }

        return ResponseEntity.ok(veterinario);
    }

    @PostMapping("/cadastro")
    @Operation(summary = "Cadastro publico de veterinario", description = "Permite cadastrar veterinario pela tela de login sem autenticacao previa.")
    public ResponseEntity<VeterinarioResponse> cadastroPublico(@Valid @RequestBody VeterinarioCadastroRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(veterinarioService.cadastrar(request));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Atualizar veterinario", description = "Atualiza os dados de um veterinario existente.")
    public ResponseEntity<?> atualizar(@PathVariable Long id, @Valid @RequestBody VeterinarioUpdateRequest request) {
        var alterarVeterinarioResult = veterinarioService.atualizar(id, request);
        return alterarVeterinarioResult ? ResponseEntity.ok("Atualizado com sucesso!") : ResponseEntity.notFound().build();
    }

    private String requireEmail(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Veterinario nao autenticado.");
        }

        String email = authentication.getName();
        if (email == null || email.isBlank()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Veterinario nao autenticado.");
        }

        return email;
    }
}
