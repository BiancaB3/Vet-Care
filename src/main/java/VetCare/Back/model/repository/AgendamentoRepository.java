package VetCare.Back.model.repository;
import VetCare.Back.model.entities.Agendamento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
@Repository
public interface AgendamentoRepository extends JpaRepository<Agendamento, Long> {}