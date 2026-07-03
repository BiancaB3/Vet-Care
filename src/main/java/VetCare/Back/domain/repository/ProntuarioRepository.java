package VetCare.Back.domain.repository;
import VetCare.Back.domain.entities.Prontuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProntuarioRepository extends JpaRepository<Prontuario, Long> {
	List<Prontuario> findByVeterinarioId(Long veterinarioId);

	Optional<Prontuario> findByIdAndVeterinarioId(Long id, Long veterinarioId);

	List<Prontuario> findByAgendamentoId(Long agendamentoId);
}