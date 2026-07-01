package VetCare.Back.presentation;

import VetCare.Back.domain.entities.Veterinario;
import VetCare.Back.domain.repository.VeterinarioRepository;
import VetCare.Back.application.services.VeterinarioService;
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
    public ResponseEntity<List<Veterinario>> listarTodos() {
        return ResponseEntity.ok(veterinarioRepository.findAll());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Buscar veterinario por id", description = "Retorna um veterinario pelo identificador informado.")
    public ResponseEntity<Veterinario> buscarPorId(@PathVariable Long id) {
        return veterinarioRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    @Operation(summary = "Cadastrar veterinario", description = "Cadastra um novo veterinario no sistema.")
    public ResponseEntity<Long> salvar(@RequestBody Veterinario veterinario) {
        return ResponseEntity.ok(veterinarioService.salvar(veterinario).getId());
    }

    @PostMapping("/cadastro")
    @Operation(summary = "Cadastro publico de veterinario", description = "Permite cadastrar veterinario pela tela de login sem autenticacao previa.")
    public ResponseEntity<?> cadastroPublico(@RequestBody Veterinario veterinario) {
        var validacao = validarCadastro(veterinario);
        if (validacao != null) {
            return validacao;
        }

        try {
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

    @PostMapping("/bootstrap")
    @Operation(summary = "Bootstrap inicial", description = "Método responsável por criar o primeiro veterinário sem autenticação prévia.")
    public ResponseEntity<?> bootstrap(@RequestBody Veterinario veterinario) {
        if (!veterinarioService.bootstrapDisponivel()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("Bootstrap inicial indisponivel: ja existe veterinario cadastrado.");
        }

        return ResponseEntity.ok(veterinarioService.salvar(veterinario).getId());
    }

    @PutMapping("/{id}")
    @Operation(summary = "Atualizar veterinario", description = "Atualiza os dados de um veterinario existente.")
    public ResponseEntity<?> atualizar(@PathVariable Long id, @RequestBody Veterinario veterinario) {
        var vetBanco = veterinarioRepository.findById(id).orElse(null);
        if (vetBanco != null) {
            veterinarioService.atualizar(vetBanco, veterinario);
            return ResponseEntity.ok("Atualizado com sucesso!");
        }
        return ResponseEntity.notFound().build();
    }

    private ResponseEntity<?> validarCadastro(Veterinario veterinario) {
        if (veterinario == null) {
            return ResponseEntity.badRequest().body("Dados do veterinario nao informados.");
        }

        if (veterinario.getNome() == null || veterinario.getNome().isBlank()) {
            return ResponseEntity.badRequest().body("Nome do veterinario e obrigatorio.");
        }

        if (veterinario.getCrmv() == null || veterinario.getCrmv().isBlank()) {
            return ResponseEntity.badRequest().body("CRMV do veterinario e obrigatorio.");
        }

        if (veterinario.getEmail() == null || veterinario.getEmail().isBlank()) {
            return ResponseEntity.badRequest().body("Email do veterinario e obrigatorio.");
        }

        if (veterinario.getSenha() == null || veterinario.getSenha().isBlank()) {
            return ResponseEntity.badRequest().body("Senha do veterinario e obrigatoria.");
        }

        return null;
    }
}
