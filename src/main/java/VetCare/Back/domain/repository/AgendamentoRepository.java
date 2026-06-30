package VetCare.Back.domain.repository;
import VetCare.Back.domain.entities.Agendamento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
@Repository
public interface AgendamentoRepository extends JpaRepository<Agendamento, Long> {}