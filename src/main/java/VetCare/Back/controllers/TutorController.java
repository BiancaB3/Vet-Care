package VetCare.Back.controllers;

import VetCare.Back.model.entities.Tutor;
import VetCare.Back.model.repository.TutorRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/tutores")
@Tag(name = "Tutores controller", description = "Controladora responsável por gerenciar os tutores!")
public class TutorController {

    @Autowired
    private TutorRepository tutorRepository;

    @GetMapping
    @Operation(summary = "Listar todos", description = "Método para listar todos os tutores!")
    public ResponseEntity<List<Tutor>> listarTodos() {
        return ResponseEntity.ok(tutorRepository.findAll());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Consulta por ID", description = "Método responsável por consultar um único tutor por ID!")
    public ResponseEntity<Tutor> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(tutorRepository.findById(id).orElse(null));
    }

    @PostMapping
    @Operation(summary = "Criar tutor", description = "Método responsável por criar um tutor!")
    public ResponseEntity<Long> salvar(@RequestBody Tutor tutor) {
        return ResponseEntity.ok(tutorRepository.save(tutor).getId());
    }

    @PutMapping("/{id}")
    @Operation(summary = "Atualizar tutor", description = "Método responsável por atualizar um tutor!")
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

    @DeleteMapping("/{id}")
    @Operation(summary = "Deletar tutor", description = "Método responsável por deletar um tutor!")
    public ResponseEntity<?> deletar(@PathVariable Long id) {
        if (!tutorRepository.existsById(id)) return ResponseEntity.notFound().build();
        tutorRepository.deleteById(id);
        return ResponseEntity.ok("Deletado com sucesso!");
    }
}