package VetCare.Back.application.services;

import VetCare.Back.application.DTO.LoginRequest;
import VetCare.Back.application.DTO.VeterinarioCadastroRequest;
import VetCare.Back.application.DTO.VeterinarioResponse;
import VetCare.Back.application.DTO.VeterinarioUpdateRequest;
import VetCare.Back.domain.entities.Veterinario;
import VetCare.Back.domain.repository.VeterinarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class VeterinarioService {

    @Autowired
    private VeterinarioRepository veterinarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public List<VeterinarioResponse> listarTodos() {
        return veterinarioRepository.findAll().stream()
                .map(this::toResponse)
                .toList();
    }

    public VeterinarioResponse buscarPorId(Long id) {
        return veterinarioRepository.findById(id)
                .map(this::toResponse)
                .orElse(null);
    }

    public VeterinarioResponse cadastrar(VeterinarioCadastroRequest request) {
        return toResponse(salvar(toEntity(request)));
    }

    public boolean atualizar(Long id, VeterinarioUpdateRequest request) {
        var veterinarioAtual = veterinarioRepository.findById(id).orElse(null);
        if (veterinarioAtual != null) {
            atualizar(veterinarioAtual, toEntity(request));
            return true;
        }

        return false;
    }

    public Optional<Veterinario> autenticar(LoginRequest loginRequest) {
        return veterinarioRepository.findByEmail(loginRequest.email())
                .filter(veterinario -> senhaConfere(loginRequest.senha(), veterinario));
    }

    public VeterinarioResponse buscarPorEmail(String email) {
        return veterinarioRepository.findByEmail(email)
                .map(this::toResponse)
                .orElse(null);
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

    private Veterinario toEntity(VeterinarioCadastroRequest request) {
        var veterinario = new Veterinario();
        veterinario.setNome(request.nome().trim());
        veterinario.setCrmv(request.crmv().trim());
        veterinario.setEspecialidade(request.especialidade() != null ? request.especialidade().trim() : null);
        veterinario.setTelefone(request.telefone() != null ? request.telefone().trim() : null);
        veterinario.setEmail(request.email().trim());
        veterinario.setSenha(request.senha());
        return veterinario;
    }

    private Veterinario toEntity(VeterinarioUpdateRequest request) {
        var veterinario = new Veterinario();
        veterinario.setNome(request.nome().trim());
        veterinario.setCrmv(request.crmv().trim());
        veterinario.setEspecialidade(request.especialidade() != null ? request.especialidade().trim() : null);
        veterinario.setTelefone(request.telefone() != null ? request.telefone().trim() : null);
        veterinario.setEmail(request.email().trim());
        veterinario.setSenha(request.senha());
        return veterinario;
    }

    private boolean isSenhaCodificada(String senha) {
        return senha.startsWith("$2a$")
                || senha.startsWith("$2b$")
                || senha.startsWith("$2y$");
    }

    public VeterinarioResponse toResponse(Veterinario veterinario) {
        return new VeterinarioResponse(
                veterinario.getId(),
                veterinario.getNome(),
                veterinario.getCrmv(),
                veterinario.getEspecialidade(),
                veterinario.getTelefone(),
                veterinario.getEmail()
        );
    }
}
