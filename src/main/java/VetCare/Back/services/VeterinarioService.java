package VetCare.Back.services;

import VetCare.Back.model.DTO.LoginRequest;
import VetCare.Back.model.repository.VeterinarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class VeterinarioService {

    @Autowired
    private VeterinarioRepository veterinarioRepository;

    public boolean validaVeterinarioSenha(LoginRequest loginRequest) {
        try {
            return veterinarioRepository.existsByEmailAndSenha(loginRequest.email(), loginRequest.senha());
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}

