package VetCare.Back.application.services;

import VetCare.Back.application.DTO.LoginRequest;
import VetCare.Back.domain.entities.Veterinario;
import VetCare.Back.domain.repository.VeterinarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class VeterinarioService {

    @Autowired
    private VeterinarioRepository veterinarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public Optional<Veterinario> autenticar(LoginRequest loginRequest) {
        return veterinarioRepository.findByEmail(loginRequest.email())
                .filter(veterinario -> senhaConfere(loginRequest.senha(), veterinario));
    }

    public Veterinario salvar(Veterinario veterinario) {
        veterinario.setSenha(codificarSenha(veterinario.getSenha()));
        return veterinarioRepository.save(veterinario);
    }

    public Veterinario atualizar(Veterinario veterinarioAtual, Veterinario dadosAtualizados) {
        veterinarioAtual.setNome(dadosAtualizados.getNome());
        veterinarioAtual.setCrmv(dadosAtualizados.getCrmv());
        veterinarioAtual.setEspecialidade(dadosAtualizados.getEspecialidade());
        veterinarioAtual.setTelefone(dadosAtualizados.getTelefone());
        veterinarioAtual.setEmail(dadosAtualizados.getEmail());

        if (dadosAtualizados.getSenha() != null && !dadosAtualizados.getSenha().isBlank()) {
            veterinarioAtual.setSenha(codificarSenha(dadosAtualizados.getSenha()));
        }

        return veterinarioRepository.save(veterinarioAtual);
    }

    public boolean bootstrapDisponivel() {
        return veterinarioRepository.count() == 0;
    }

    private boolean senhaConfere(String senhaInformada, Veterinario veterinario) {
        String senhaSalva = veterinario.getSenha();

        if (senhaInformada == null || senhaSalva == null || senhaSalva.isBlank()) {
            return false;
        }

        if (isSenhaCodificada(senhaSalva)) {
            return passwordEncoder.matches(senhaInformada, senhaSalva);
        }

        if (senhaSalva.equals(senhaInformada)) {
            veterinario.setSenha(passwordEncoder.encode(senhaInformada));
            veterinarioRepository.save(veterinario);
            return true;
        }

        return false;
    }

    private String codificarSenha(String senha) {
        if (senha == null || senha.isBlank() || isSenhaCodificada(senha)) {
            return senha;
        }

        return passwordEncoder.encode(senha);
    }

    private boolean isSenhaCodificada(String senha) {
        return senha.startsWith("$2a$")
                || senha.startsWith("$2b$")
                || senha.startsWith("$2y$");
    }
}
