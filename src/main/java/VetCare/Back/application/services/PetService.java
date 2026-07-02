package VetCare.Back.application.services;

import VetCare.Back.application.DTO.PetRequest;
import VetCare.Back.application.DTO.PetResponse;
import VetCare.Back.domain.entities.Pet;
import VetCare.Back.domain.entities.Tutor;
import VetCare.Back.domain.entities.Veterinario;
import VetCare.Back.domain.repository.PetRepository;
import VetCare.Back.domain.repository.TutorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PetService {

    @Autowired
    private PetRepository petRepository;

    @Autowired
    private TutorRepository tutorRepository;

    public List<Pet> listarTodos(Long veterinarioId) {
        return petRepository.findByTutorVeterinarioId(veterinarioId);
    }

    public List<PetResponse> listarTodosResponse(Long veterinarioId) {
        return listarTodos(veterinarioId).stream()
                .map(this::toResponse)
                .toList();
    }

    public Optional<Pet> buscarPorId(Long id, Long veterinarioId) {
        return petRepository.findByIdAndTutorVeterinarioId(id, veterinarioId);
    }

    public PetResponse buscarPorIdResponse(Long id, Long veterinarioId) {
        return buscarPorId(id, veterinarioId)
                .map(this::toResponse)
                .orElse(null);
    }

    public PetResponse salvar(PetRequest petRequest, Veterinario veterinario) {
        validarPet(petRequest);

        var tutor = buscarTutorDoVeterinario(petRequest, veterinario);
        if (tutor == null) {
            throw new IllegalArgumentException("Tutor informado nao existe.");
        }

        var pet = toEntity(petRequest);
        pet.setTutor(tutor);
        return toResponse(petRepository.save(pet));
    }

    public void atualizar(Long id, PetRequest petRequest, Veterinario veterinario) {
        validarPet(petRequest);

        var petBanco = petRepository.findByIdAndTutorVeterinarioId(id, veterinario.getId()).orElse(null);
        if (petBanco == null) {
            return;
        }

        var tutor = buscarTutorDoVeterinario(petRequest, veterinario);
        if (tutor == null) {
            throw new IllegalArgumentException("Tutor informado nao existe.");
        }

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
    }

    private Tutor buscarTutorDoVeterinario(PetRequest petRequest, Veterinario veterinario) {
        if (petRequest.tutor() == null || petRequest.tutor().id() == null) {
            throw new IllegalArgumentException("Informe tutor.id para salvar o pet.");
        }

        return tutorRepository.findByIdAndVeterinarioId(petRequest.tutor().id(), veterinario.getId()).orElse(null);
    }

    private void validarPet(PetRequest pet) {
        if (pet == null) {
            throw new IllegalArgumentException("Dados do pet nao informados.");
        }

        if (pet.nome() == null || pet.nome().isBlank()) {
            throw new IllegalArgumentException("Nome do pet e obrigatorio.");
        }

        if (pet.especie() == null || pet.especie().isBlank()) {
            throw new IllegalArgumentException("Especie do pet e obrigatoria.");
        }

        if (pet.sexo() == null || pet.sexo().isBlank()) {
            throw new IllegalArgumentException("Sexo do pet e obrigatorio.");
        }

        if (pet.cor() == null || pet.cor().isBlank()) {
            throw new IllegalArgumentException("Cor do pet e obrigatoria.");
        }
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
}