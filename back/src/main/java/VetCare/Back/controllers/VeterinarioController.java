package VetCare.Back.controllers;

import VetCare.Back.model.entities.Veterinario;
import VetCare.Back.model.repository.VeterinarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/veterinarios")
public class VeterinarioController {

    @Autowired
    private VeterinarioRepository veterinarioRepository;

    @GetMapping
    public ResponseEntity<List<Veterinario>> listarTodos() {
        return ResponseEntity.ok(veterinarioRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Veterinario> buscarPorId(@PathVariable Long id) {
        var veterinario = veterinarioRepository.findById(id);
        return veterinario.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Veterinario> salvar(@RequestBody Veterinario veterinario) {
        return ResponseEntity.ok(veterinarioRepository.save(veterinario));
    }

    @PutMapping("/{id}")
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

        return ResponseEntity.ok(veterinarioRepository.save(veterinarioBanco));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        if (!veterinarioRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        veterinarioRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}

