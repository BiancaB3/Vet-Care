package VetCare.Back.domain.repository;
import VetCare.Back.domain.entities.Tutor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TutorRepository extends JpaRepository<Tutor, Long> {
	List<Tutor> findByVeterinarioId(Long veterinarioId);

	Optional<Tutor> findByIdAndVeterinarioId(Long id, Long veterinarioId);

	boolean existsByIdAndVeterinarioId(Long id, Long veterinarioId);
}