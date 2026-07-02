package VetCare.Back.presentation;

import VetCare.Back.application.DTO.VeterinarioCadastroRequest;
import VetCare.Back.application.DTO.VeterinarioResponse;
import VetCare.Back.application.DTO.VeterinarioUpdateRequest;
import VetCare.Back.domain.entities.Veterinario;
import VetCare.Back.domain.repository.VeterinarioRepository;
import VetCare.Back.application.services.VeterinarioService;
import jakarta.validation.Valid;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Locale;
import java.util.List;

@RestController
@RequestMapping("/veterinarios")
@Tag(name = "Veterinarios", description = "Endpoints para gerenciamento dos veterinarios do VetCare.")
public class VeterinarioController {

    @Autowired
    private VeterinarioRepository veterinarioRepository;

    @Autowired
    private VeterinarioService veterinarioService;

    @GetMapping
    @Operation(summary = "Listar veterinarios", description = "Retorna a lista de veterinarios cadastrados.")
    public ResponseEntity<List<VeterinarioResponse>> listarTodos() {
        var resposta = veterinarioRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();

        return ResponseEntity.ok(resposta);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Buscar veterinario por id", description = "Retorna um veterinario pelo identificador informado.")
    public ResponseEntity<VeterinarioResponse> buscarPorId(@PathVariable Long id) {
        return veterinarioRepository.findById(id)
                .map(this::toResponse)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping("/cadastro")
    @Operation(summary = "Cadastro publico de veterinario", description = "Permite cadastrar veterinario pela tela de login sem autenticacao previa.")
    public ResponseEntity<?> cadastroPublico(@Valid @RequestBody VeterinarioCadastroRequest request) {

        try {
            var veterinario = toEntity(request);
            return ResponseEntity.ok(veterinarioService.salvar(veterinario).getId());
        } catch (Exception ex) {
            var mensagem = ex.getMessage() == null ? "" : ex.getMessage().toLowerCase(Locale.ROOT);
            if (mensagem.contains("email") || mensagem.contains("crmv") || mensagem.contains("duplicate") || mensagem.contains("unique")) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body("Ja existe um veterinario cadastrado com este email ou CRMV.");
            }

            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Nao foi possivel concluir o cadastro do veterinario.");
        }
    }

    @PutMapping("/{id}")
    @Operation(summary = "Atualizar veterinario", description = "Atualiza os dados de um veterinario existente.")
    public ResponseEntity<?> atualizar(@PathVariable Long id, @Valid @RequestBody VeterinarioUpdateRequest request) {
        var vetBanco = veterinarioRepository.findById(id).orElse(null);
        if (vetBanco != null) {
            var veterinario = toEntity(request);
            veterinarioService.atualizar(vetBanco, veterinario);
            return ResponseEntity.ok("Atualizado com sucesso!");
        }
        return ResponseEntity.notFound().build();
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

    private VeterinarioResponse toResponse(Veterinario veterinario) {
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
