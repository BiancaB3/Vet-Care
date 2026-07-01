package VetCare.Back.presentation;

import VetCare.Back.domain.entities.Pet;
import VetCare.Back.domain.repository.PetRepository;
import VetCare.Back.domain.repository.TutorRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/pets")
@Tag(name = "Pets", description = "Endpoints para gerenciamento dos pets do VetCare.")
public class PetController {

    @Autowired private PetRepository petRepository;
    @Autowired private TutorRepository tutorRepository;

    @GetMapping
    @Operation(summary = "Listar pets", description = "Retorna a lista de pets cadastrados.")
    public ResponseEntity<List<Pet>> listarTodos() { return ResponseEntity.ok(petRepository.findAll()); }

    @GetMapping("/{id}")
    @Operation(summary = "Buscar pet por id", description = "Retorna um pet pelo identificador informado.")
    public ResponseEntity<Pet> buscarPorId(@PathVariable Long id) {
        return petRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    @Operation(summary = "Cadastrar pet", description = "Cadastra um novo pet no sistema.")
    public ResponseEntity<?> salvar(@RequestBody Pet pet) {
        var validacao = validarPet(pet);
        if (validacao != null) return validacao;

        if (pet.getTutor() == null || pet.getTutor().getId() == null)
            return ResponseEntity.badRequest().body("Informe tutor.id para salvar o pet.");
        var tutor = tutorRepository.findById(pet.getTutor().getId()).orElse(null);
        if (tutor == null) return ResponseEntity.badRequest().body("Tutor informado nao existe.");
        pet.setTutor(tutor);
        return ResponseEntity.ok(petRepository.save(pet).getId());
    }

    @PutMapping("/{id}")
    @Operation(summary = "Atualizar pet", description = "Atualiza os dados de um pet existente.")
    public ResponseEntity<?> atualizar(@PathVariable Long id, @RequestBody Pet pet) {
        var validacao = validarPet(pet);
        if (validacao != null) return validacao;

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

    private ResponseEntity<?> validarPet(Pet pet) {
        if (pet == null) return ResponseEntity.badRequest().body("Dados do pet nao informados.");

        if (pet.getNome() == null || pet.getNome().isBlank()) {
            return ResponseEntity.badRequest().body("Nome do pet e obrigatorio.");
        }

        if (pet.getEspecie() == null || pet.getEspecie().isBlank()) {
            return ResponseEntity.badRequest().body("Especie do pet e obrigatoria.");
        }

        if (pet.getSexo() == null || pet.getSexo().isBlank()) {
            return ResponseEntity.badRequest().body("Sexo do pet e obrigatorio.");
        }

        if (pet.getCor() == null || pet.getCor().isBlank()) {
            return ResponseEntity.badRequest().body("Cor do pet e obrigatoria.");
        }

        return null;
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Excluir pet", description = "Remove um pet pelo identificador informado.")
    public ResponseEntity<?> excluir(@PathVariable Long id) {
        var existe = petRepository.existsById(id);
        if (!existe) return ResponseEntity.notFound().build();
        petRepository.deleteById(id);
        return ResponseEntity.ok("Removido com sucesso!");
    }
}