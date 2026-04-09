package vetcare.back.controllers;

import vetcare.back.model.entities.Tutor;
import vetcare.back.model.repository.TutorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/tutores")
public class TutorController {

    @Autowired
    private TutorRepository tutorRepository;

    @GetMapping
    public ResponseEntity<List<Tutor>> listarTodos() {
        return ResponseEntity.ok(tutorRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Tutor> buscarPorId(@PathVariable Long id) {
        var tutor = tutorRepository.findById(id);
        return tutor.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Tutor> salvar(@RequestBody Tutor tutor) {
        return ResponseEntity.ok(tutorRepository.save(tutor));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Tutor> atualizar(@PathVariable Long id, @RequestBody Tutor tutor) {
        var tutorBanco = tutorRepository.findById(id).orElse(null);
        if (tutorBanco == null) {
            return ResponseEntity.notFound().build();
        }

        tutorBanco.setNome(tutor.getNome());
        tutorBanco.setCpf(tutor.getCpf());
        tutorBanco.setTelefone(tutor.getTelefone());
        tutorBanco.setEmail(tutor.getEmail());
        tutorBanco.setEndereco(tutor.getEndereco());
        return ResponseEntity.ok(tutorRepository.save(tutorBanco));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        if (!tutorRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        tutorRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
