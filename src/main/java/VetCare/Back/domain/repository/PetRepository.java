package VetCare.Back.domain.repository;
import VetCare.Back.domain.entities.Pet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PetRepository extends JpaRepository<Pet, Long> {
    List<Pet> findByTutorId(Long tutorId);

    List<Pet> findByTutorVeterinarioId(Long veterinarioId);

    Optional<Pet> findByIdAndTutorVeterinarioId(Long id, Long veterinarioId);

    boolean existsByIdAndTutorVeterinarioId(Long id, Long veterinarioId);
}