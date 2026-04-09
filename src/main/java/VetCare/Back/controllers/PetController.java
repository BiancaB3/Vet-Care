package VetCare.Back.controllers;

import VetCare.Back.model.entities.Pet;
import VetCare.Back.model.repository.PetRepository;
import VetCare.Back.model.repository.TutorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/pets")
public class PetController {

    @Autowired
    private PetRepository petRepository;

    @Autowired
    private TutorRepository tutorRepository;

    @GetMapping
    public ResponseEntity<List<Pet>> listarTodos() {
        return ResponseEntity.ok(petRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Pet> buscarPorId(@PathVariable Long id) {
        var pet = petRepository.findById(id);
        return pet.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> salvar(@RequestBody Pet pet) {
        if (pet.getTutor() == null || pet.getTutor().getId() == null) {
            return ResponseEntity.badRequest().body("Informe tutor.id para salvar o pet.");
        }

        var tutor = tutorRepository.findById(pet.getTutor().getId()).orElse(null);
        if (tutor == null) {
            return ResponseEntity.badRequest().body("Tutor informado nao existe.");
        }

        pet.setTutor(tutor);
        return ResponseEntity.ok(petRepository.save(pet));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> atualizar(@PathVariable Long id, @RequestBody Pet pet) {
        var petBanco = petRepository.findById(id).orElse(null);
        if (petBanco == null) {
            return ResponseEntity.notFound().build();
        }

        if (pet.getTutor() == null || pet.getTutor().getId() == null) {
            return ResponseEntity.badRequest().body("Informe tutor.id para atualizar o pet.");
        }

        var tutor = tutorRepository.findById(pet.getTutor().getId()).orElse(null);
        if (tutor == null) {
            return ResponseEntity.badRequest().body("Tutor informado nao existe.");
        }

        petBanco.setNome(pet.getNome());
        petBanco.setEspecie(pet.getEspecie());
        petBanco.setRaca(pet.getRaca());
        petBanco.setIdade(pet.getIdade());
        petBanco.setPeso(pet.getPeso());
        petBanco.setSexo(pet.getSexo());
        petBanco.setCor(pet.getCor());
        petBanco.setTutor(tutor);

        return ResponseEntity.ok(petRepository.save(petBanco));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        if (!petRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        petRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}

