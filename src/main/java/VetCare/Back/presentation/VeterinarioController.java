package VetCare.Back.presentation;

import VetCare.Back.model.entities.Veterinario;
import VetCare.Back.model.repository.VeterinarioRepository;
import VetCare.Back.services.VeterinarioService;
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
@Tag(name = "Veterinarios controller", description = "Controladora responsável por gerenciar os veterinários!")
public class VeterinarioController {

    @Autowired
    private VeterinarioRepository veterinarioRepository;

    @Autowired
    private VeterinarioService veterinarioService;

    @GetMapping
    @Operation(summary = "Listar todos", description = "Método para listar todos os veterinários!")
    public ResponseEntity<List<Veterinario>> listarTodos() {
        return ResponseEntity.ok(veterinarioRepository.findAll());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Consulta por ID", description = "Método responsável por consultar um único veterinário por ID!")
    public ResponseEntity<Veterinario> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(veterinarioRepository.findById(id).orElse(null));
    }

    @PostMapping
    @Operation(summary = "Criar veterinário", description = "Método responsável por criar um veterinário!")
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
    @Operation(summary = "Atualizar veterinário", description = "Método responsável por atualizar um veterinário!")
    public ResponseEntity<?> atualizar(@PathVariable Long id, @RequestBody Veterinario veterinario) {
        var vetBanco = veterinarioRepository.findById(id).orElse(null);
        if (vetBanco != null) {
            veterinarioService.atualizar(vetBanco, veterinario);
            return ResponseEntity.ok("Atualizado com sucesso!");
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Deletar veterinário", description = "Método responsável por deletar um veterinário!")
    public ResponseEntity<?> deletar(@PathVariable Long id) {
        if (!veterinarioRepository.existsById(id)) return ResponseEntity.notFound().build();
        veterinarioRepository.deleteById(id);
        return ResponseEntity.ok("Deletado com sucesso!");
    }
}
