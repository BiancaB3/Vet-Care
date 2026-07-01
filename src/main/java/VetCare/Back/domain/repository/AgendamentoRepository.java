package VetCare.Back.domain.repository;
import VetCare.Back.domain.entities.Agendamento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AgendamentoRepository extends JpaRepository<Agendamento, Long> {
	List<Agendamento> findByVeterinarioId(Long veterinarioId);

	Optional<Agendamento> findByIdAndVeterinarioId(Long id, Long veterinarioId);
}