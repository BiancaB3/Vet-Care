package VetCare.Back.domain.repository;
import VetCare.Back.domain.entities.Veterinario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
@Repository
public interface VeterinarioRepository extends JpaRepository<Veterinario, Long> {
    Optional<Veterinario> findByEmail(String email);

    boolean existsByEmailAndSenha(String email, String senha);
}