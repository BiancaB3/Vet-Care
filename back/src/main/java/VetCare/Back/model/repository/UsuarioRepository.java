package VetCare.Back.model.repository;

import VetCare.Back.model.entities.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface UsuarioRepository extends JpaRepository<Usuario,Long> {
}

