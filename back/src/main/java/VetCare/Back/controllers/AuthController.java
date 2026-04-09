package VetCare.Back.controllers;

import VetCare.Back.model.DTO.LoginRequest;
import VetCare.Back.model.DTO.LoginResponse;
import VetCare.Back.model.entities.Veterinario;
import VetCare.Back.model.repository.VeterinarioRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/auth")
@Tag(name = "Auth controller", description = "Controladora responsável pela autenticação!")
public class AuthController {

    private static final Logger log = LoggerFactory.getLogger(AuthController.class);

    @Autowired
    private VeterinarioRepository veterinarioRepository;

    @PostMapping("/login")
    @Operation(summary = "Login", description = "Método responsável por autenticar o veterinário!")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        String email = request != null ? request.email() : null;
        log.info("Recebido POST /auth/login para email={}", maskEmail(email));

        if (request == null || request.email() == null || request.email().isBlank() || request.senha() == null || request.senha().isBlank()) {
            log.warn("POST /auth/login retornando 400 - payload inválido para email={}", maskEmail(email));
            return ResponseEntity.badRequest().body("Email e senha são obrigatórios.");
        }

        var vet = veterinarioRepository.findByEmail(request.email()).orElse(null);
        if (vet == null || !vet.getSenha().equals(request.senha())) {
            log.warn("POST /auth/login retornando 401 - credenciais inválidas para email={}", maskEmail(request.email()));
            return ResponseEntity.status(401).body("Email ou senha inválidos!");
        }

        String token = UUID.randomUUID().toString();
        log.info("POST /auth/login retornando 200 - login OK para vetId={} email={}", vet.getId(), maskEmail(vet.getEmail()));
        return ResponseEntity.ok(buildLoginResponse(vet, token));
    }

    private LoginResponse buildLoginResponse(Veterinario vet, String token) {
        return new LoginResponse(
                token,
                new LoginResponse.Usuario(
                        vet.getId(),
                        vet.getNome(),
                        vet.getCrmv(),
                        vet.getEspecialidade(),
                        vet.getTelefone(),
                        vet.getEmail()
                )
        );
    }

    private String maskEmail(String email) {
        if (email == null || email.isBlank()) {
            return "<null>";
        }
        int at = email.indexOf('@');
        if (at <= 1) {
            return "***";
        }
        return email.charAt(0) + "***" + email.substring(at);
    }
}