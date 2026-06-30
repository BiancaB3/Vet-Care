package VetCare.Back.application.services;

import VetCare.Back.model.repository.VeterinarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class VeterinarioUserDetailsService implements UserDetailsService {

    @Autowired
    private VeterinarioRepository veterinarioRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return veterinarioRepository.findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException("Veterinario nao encontrado para o email informado."));
    }
}
