package VetCare.Back.model.repository;
import VetCare.Back.model.entities.Prontuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
@Repository
public interface ProntuarioRepository extends JpaRepository<Prontuario, Long> {}