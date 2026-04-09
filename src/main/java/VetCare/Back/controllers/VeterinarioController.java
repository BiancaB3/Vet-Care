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
@Tag(name = "Veterinarios", description = "CRUD de veterinarios do sistema")
public class VeterinarioController {

    @Autowired
    private VeterinarioRepository veterinarioRepository;

    @GetMapping
    @Operation(summary = "Lista todos os veterinarios")
    public ResponseEntity<List<Veterinario>> listarTodos() {
        return ResponseEntity.ok(veterinarioRepository.findAll());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Busca veterinario por id")
    public ResponseEntity<Veterinario> buscarPorId(@PathVariable Long id) {
        var veterinario = veterinarioRepository.findById(id);
        return veterinario.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    @Operation(summary = "Cadastra veterinario", description = "Cria veterinario com email e senha usados no login")
    public ResponseEntity<Veterinario> salvar(@RequestBody Veterinario veterinario) {
        return ResponseEntity.ok(veterinarioRepository.save(veterinario));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Atualiza veterinario")
    public ResponseEntity<Veterinario> atualizar(@PathVariable Long id, @RequestBody Veterinario veterinario) {
        var veterinarioBanco = veterinarioRepository.findById(id).orElse(null);
        if (veterinarioBanco == null) {
            return ResponseEntity.notFound().build();
        }

        veterinarioBanco.setNome(veterinario.getNome());
        veterinarioBanco.setCrmv(veterinario.getCrmv());
        veterinarioBanco.setEspecialidade(veterinario.getEspecialidade());
        veterinarioBanco.setTelefone(veterinario.getTelefone());
        veterinarioBanco.setEmail(veterinario.getEmail());
        veterinarioBanco.setSenha(veterinario.getSenha());

        return ResponseEntity.ok(veterinarioRepository.save(veterinarioBanco));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Remove veterinario")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        if (!veterinarioRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        veterinarioRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}

