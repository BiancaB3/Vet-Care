package VetCare.Back.presentation;

import VetCare.Back.domain.entities.Tutor;
import VetCare.Back.domain.repository.TutorRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/tutores")
@CrossOrigin(origins = "*", maxAge = 3600)
@Tag(name = "Tutores", description = "Endpoints para gerenciamento dos tutores do VetCare.")
public class TutorController {

    @Autowired
    private TutorRepository tutorRepository;

    @GetMapping
    @Operation(summary = "Listar tutores", description = "Retorna a lista de tutores cadastrados.")
    public ResponseEntity<List<Tutor>> listarTodos() {
        return ResponseEntity.ok(tutorRepository.findAll());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Buscar tutor por id", description = "Retorna um tutor pelo identificador informado.")
    public ResponseEntity<Tutor> buscarPorId(@PathVariable Long id) {
        return tutorRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    @Operation(summary = "Cadastrar tutor", description = "Cadastra um novo tutor no sistema.")
    public ResponseEntity<Long> salvar(@RequestBody Tutor tutor) {
        return ResponseEntity.ok(tutorRepository.save(tutor).getId());
    }

    @PutMapping("/{id}")
    @Operation(summary = "Atualizar tutor", description = "Atualiza os dados de um tutor existente.")
    public ResponseEntity<?> atualizar(@PathVariable Long id, @RequestBody Tutor tutor) {
        var tutorBanco = tutorRepository.findById(id).orElse(null);
        if (tutorBanco != null) {
            tutorBanco.setNome(tutor.getNome());
            tutorBanco.setCpf(tutor.getCpf());
            tutorBanco.setTelefone(tutor.getTelefone());
            tutorBanco.setEmail(tutor.getEmail());
            tutorBanco.setEndereco(tutor.getEndereco());
            tutorBanco.setStatus(tutor.getStatus());
            tutorRepository.save(tutorBanco);
            return ResponseEntity.ok("Atualizado com sucesso!");
        }
        return ResponseEntity.notFound().build();
    }
}