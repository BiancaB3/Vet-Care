package VetCare.Back.presentation;

import VetCare.Back.application.DTO.PetRequest;
import VetCare.Back.application.DTO.PetResponse;
import VetCare.Back.domain.entities.Pet;
import VetCare.Back.domain.repository.PetRepository;
import VetCare.Back.domain.repository.TutorRepository;
import VetCare.Back.domain.repository.VeterinarioRepository;
import jakarta.validation.Valid;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/pets")
@Tag(name = "Pets", description = "Endpoints para gerenciamento dos pets do VetCare.")
public class PetController {

    @Autowired private PetRepository petRepository;
    @Autowired private TutorRepository tutorRepository;
    @Autowired private VeterinarioRepository veterinarioRepository;

    @GetMapping
    @Operation(summary = "Listar pets", description = "Retorna a lista de pets cadastrados.")
    public ResponseEntity<List<PetResponse>> listarTodos() {
        var veterinario = obterVeterinarioAutenticado();
        if (veterinario == null) {
            return ResponseEntity.status(401).build();
        }

        var resposta = petRepository.findByTutorVeterinarioId(veterinario.getId())
                .stream()
                .map(this::toResponse)
                .toList();

        return ResponseEntity.ok(resposta);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Buscar pet por id", description = "Retorna um pet pelo identificador informado.")
    public ResponseEntity<PetResponse> buscarPorId(@PathVariable Long id) {
        var veterinario = obterVeterinarioAutenticado();
        if (veterinario == null) {
            return ResponseEntity.status(401).build();
        }

        return petRepository.findByIdAndTutorVeterinarioId(id, veterinario.getId())
                .map(this::toResponse)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    @Operation(summary = "Cadastrar pet", description = "Cadastra um novo pet no sistema.")
    public ResponseEntity<?> salvar(@Valid @RequestBody PetRequest petRequest) {
        var veterinario = obterVeterinarioAutenticado();
        if (veterinario == null) {
            return ResponseEntity.status(401).body("Veterinario nao autenticado.");
        }

        var validacao = validarPet(petRequest);
        if (validacao != null) return validacao;

        if (petRequest.tutor() == null || petRequest.tutor().id() == null)
            return ResponseEntity.badRequest().body("Informe tutor.id para salvar o pet.");
        var tutor = tutorRepository.findByIdAndVeterinarioId(petRequest.tutor().id(), veterinario.getId()).orElse(null);
        if (tutor == null) return ResponseEntity.badRequest().body("Tutor informado nao existe.");

        var pet = toEntity(petRequest);
        pet.setTutor(tutor);
        return ResponseEntity.ok(petRepository.save(pet).getId());
    }

    @PutMapping("/{id}")
    @Operation(summary = "Atualizar pet", description = "Atualiza os dados de um pet existente.")
    public ResponseEntity<?> atualizar(@PathVariable Long id, @Valid @RequestBody PetRequest petRequest) {
        var veterinario = obterVeterinarioAutenticado();
        if (veterinario == null) {
            return ResponseEntity.status(401).body("Veterinario nao autenticado.");
        }

        var validacao = validarPet(petRequest);
        if (validacao != null) return validacao;

        var petBanco = petRepository.findByIdAndTutorVeterinarioId(id, veterinario.getId()).orElse(null);
        if (petBanco == null) return ResponseEntity.notFound().build();
        if (petRequest.tutor() == null || petRequest.tutor().id() == null)
            return ResponseEntity.badRequest().body("Informe tutor.id para atualizar o pet.");
        var tutor = tutorRepository.findByIdAndVeterinarioId(petRequest.tutor().id(), veterinario.getId()).orElse(null);
        if (tutor == null) return ResponseEntity.badRequest().body("Tutor informado nao existe.");

        var petAtualizado = toEntity(petRequest);
        petBanco.setNome(petAtualizado.getNome());
        petBanco.setEspecie(petAtualizado.getEspecie());
        petBanco.setRaca(petAtualizado.getRaca());
        petBanco.setIdade(petAtualizado.getIdade());
        petBanco.setPeso(petAtualizado.getPeso());
        petBanco.setSexo(petAtualizado.getSexo());
        petBanco.setCor(petAtualizado.getCor());
        petBanco.setTutor(tutor);
        petRepository.save(petBanco);
        return ResponseEntity.ok("Atualizado com sucesso!");
    }

    private ResponseEntity<?> validarPet(PetRequest pet) {
        if (pet == null) return ResponseEntity.badRequest().body("Dados do pet nao informados.");

        if (pet.nome() == null || pet.nome().isBlank()) {
            return ResponseEntity.badRequest().body("Nome do pet e obrigatorio.");
        }

        if (pet.especie() == null || pet.especie().isBlank()) {
            return ResponseEntity.badRequest().body("Especie do pet e obrigatoria.");
        }

        if (pet.sexo() == null || pet.sexo().isBlank()) {
            return ResponseEntity.badRequest().body("Sexo do pet e obrigatorio.");
        }

        if (pet.cor() == null || pet.cor().isBlank()) {
            return ResponseEntity.badRequest().body("Cor do pet e obrigatoria.");
        }

        return null;
    }

    private Pet toEntity(PetRequest request) {
        var pet = new Pet();
        pet.setNome(request.nome().trim());
        pet.setEspecie(request.especie().trim());
        pet.setRaca(request.raca());
        pet.setIdade(request.idade());
        pet.setPeso(request.peso());
        pet.setSexo(request.sexo().trim());
        pet.setCor(request.cor().trim());
        return pet;
    }

    private PetResponse toResponse(Pet pet) {
        Long tutorId = null;
        if (pet.getTutor() != null) {
            tutorId = pet.getTutor().getId();
        }

        return new PetResponse(
                pet.getId(),
                pet.getNome(),
                pet.getEspecie(),
                pet.getRaca(),
                pet.getIdade(),
                pet.getPeso(),
                pet.getSexo(),
                pet.getCor(),
                tutorId
        );
    }

    private VetCare.Back.domain.entities.Veterinario obterVeterinarioAutenticado() {
        Authentication authentication = org.springframework.security.core.context.SecurityContextHolder
                .getContext()
                .getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()) {
            return null;
        }

        var principal = authentication.getPrincipal();
        if (principal instanceof VetCare.Back.domain.entities.Veterinario veterinario) {
            return veterinario;
        }

        return veterinarioRepository.findByEmail(authentication.getName()).orElse(null);
    }
}