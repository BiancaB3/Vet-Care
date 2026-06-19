package VetCare.Back.controllers;

import VetCare.Back.model.entities.Veterinario;
import VetCare.Back.model.repository.VeterinarioRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/veterinarios")
@Tag(name = "Veterinarios controller", description = "Controladora responsável por gerenciar os veterinários!")
public class VeterinarioController {

    @Autowired
    private VeterinarioRepository veterinarioRepository;

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
        return ResponseEntity.ok(veterinarioRepository.save(veterinario).getId());
    }

    @PutMapping("/{id}")
    @Operation(summary = "Atualizar veterinário", description = "Método responsável por atualizar um veterinário!")
    public ResponseEntity<?> atualizar(@PathVariable Long id, @RequestBody Veterinario veterinario) {
        var vetBanco = veterinarioRepository.findById(id).orElse(null);
        if (vetBanco != null) {
            vetBanco.setNome(veterinario.getNome());
            vetBanco.setCrmv(veterinario.getCrmv());
            vetBanco.setEspecialidade(veterinario.getEspecialidade());
            vetBanco.setTelefone(veterinario.getTelefone());
            vetBanco.setEmail(veterinario.getEmail());
            vetBanco.setSenha(veterinario.getSenha());
            veterinarioRepository.save(vetBanco);
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
