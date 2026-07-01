package VetCare.Back.presentation;

import VetCare.Back.domain.entities.Veterinario;
import VetCare.Back.domain.repository.VeterinarioRepository;
import VetCare.Back.application.services.VeterinarioService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/veterinarios")
@CrossOrigin(origins = "*", maxAge = 3600)
@Tag(name = "Veterinarios", description = "Endpoints para gerenciamento dos veterinarios do VetCare.")
public class VeterinarioController {

    @Autowired
    private VeterinarioRepository veterinarioRepository;

    @Autowired
    private VeterinarioService veterinarioService;

    @GetMapping
    @Operation(summary = "Listar veterinarios", description = "Retorna a lista de veterinarios cadastrados.")
    public ResponseEntity<List<Veterinario>> listarTodos() {
        return ResponseEntity.ok(veterinarioRepository.findAll());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Buscar veterinario por id", description = "Retorna um veterinario pelo identificador informado.")
    public ResponseEntity<Veterinario> buscarPorId(@PathVariable Long id) {
        return veterinarioRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    @Operation(summary = "Cadastrar veterinario", description = "Cadastra um novo veterinario no sistema.")
    public ResponseEntity<Long> salvar(@RequestBody Veterinario veterinario) {
        return ResponseEntity.ok(veterinarioService.salvar(veterinario).getId());
    }

    @PostMapping("/bootstrap")
    @Operation(summary = "Bootstrap inicial", description = "Método responsável por criar o primeiro veterinário sem autenticação prévia.")
    public ResponseEntity<?> bootstrap(@RequestBody Veterinario veterinario) {
        if (!veterinarioService.bootstrapDisponivel()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("Bootstrap inicial indisponivel: ja existe veterinario cadastrado.");
        }

        return ResponseEntity.ok(veterinarioService.salvar(veterinario).getId());
    }

    @PutMapping("/{id}")
    @Operation(summary = "Atualizar veterinario", description = "Atualiza os dados de um veterinario existente.")
    public ResponseEntity<?> atualizar(@PathVariable Long id, @RequestBody Veterinario veterinario) {
        var vetBanco = veterinarioRepository.findById(id).orElse(null);
        if (vetBanco != null) {
            veterinarioService.atualizar(vetBanco, veterinario);
            return ResponseEntity.ok("Atualizado com sucesso!");
        }
        return ResponseEntity.notFound().build();
    }
}
