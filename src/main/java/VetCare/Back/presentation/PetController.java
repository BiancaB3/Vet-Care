package VetCare.Back.presentation;

import VetCare.Back.model.entities.Pet;
import VetCare.Back.model.repository.PetRepository;
import VetCare.Back.model.repository.TutorRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/pets")
@CrossOrigin(origins = "*", maxAge = 3600)
@Tag(name = "Pets controller", description = "Controladora responsável por gerenciar os pets!")
public class PetController {

    @Autowired private PetRepository petRepository;
    @Autowired private TutorRepository tutorRepository;

    @GetMapping
    @Operation(summary = "Listar todos", description = "Método para listar todos os pets!")
    public ResponseEntity<List<Pet>> listarTodos() { return ResponseEntity.ok(petRepository.findAll()); }

    @GetMapping("/{id}")
    @Operation(summary = "Consulta por ID", description = "Método responsável por consultar um único pet por ID!")
    public ResponseEntity<Pet> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(petRepository.findById(id).orElse(null));
    }

    @PostMapping
    @Operation(summary = "Criar pet", description = "Método responsável por criar um pet!")
    public ResponseEntity<?> salvar(@RequestBody Pet pet) {
        if (pet.getTutor() == null || pet.getTutor().getId() == null)
            return ResponseEntity.badRequest().body("Informe tutor.id para salvar o pet.");
        var tutor = tutorRepository.findById(pet.getTutor().getId()).orElse(null);
        if (tutor == null) return ResponseEntity.badRequest().body("Tutor informado nao existe.");
        pet.setTutor(tutor);
        return ResponseEntity.ok(petRepository.save(pet).getId());
    }

    @PutMapping("/{id}")
    @Operation(summary = "Atualizar pet", description = "Método responsável por atualizar um pet!")
    public ResponseEntity<?> atualizar(@PathVariable Long id, @RequestBody Pet pet) {
        var petBanco = petRepository.findById(id).orElse(null);
        if (petBanco == null) return ResponseEntity.notFound().build();
        if (pet.getTutor() == null || pet.getTutor().getId() == null)
            return ResponseEntity.badRequest().body("Informe tutor.id para atualizar o pet.");
        var tutor = tutorRepository.findById(pet.getTutor().getId()).orElse(null);
        if (tutor == null) return ResponseEntity.badRequest().body("Tutor informado nao existe.");
        petBanco.setNome(pet.getNome()); petBanco.setEspecie(pet.getEspecie());
        petBanco.setRaca(pet.getRaca()); petBanco.setIdade(pet.getIdade());
        petBanco.setPeso(pet.getPeso()); petBanco.setSexo(pet.getSexo());
        petBanco.setCor(pet.getCor()); petBanco.setTutor(tutor);
        petRepository.save(petBanco);
        return ResponseEntity.ok("Atualizado com sucesso!");
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Deletar pet", description = "Método responsável por deletar um pet!")
    public ResponseEntity<?> deletar(@PathVariable Long id) {
        if (!petRepository.existsById(id)) return ResponseEntity.notFound().build();
        petRepository.deleteById(id);
        return ResponseEntity.ok("Deletado com sucesso!");
    }
}