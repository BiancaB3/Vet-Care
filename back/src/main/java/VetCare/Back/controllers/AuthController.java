package VetCare.Back.controllers;

import VetCare.Back.model.DTO.LoginRequest;
import VetCare.Back.model.DTO.LoginResponse;
import VetCare.Back.model.entities.Veterinario;
import VetCare.Back.model.repository.VeterinarioRepository;
import VetCare.Back.services.TokenService;
import VetCare.Back.services.VeterinarioService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@Tag(name = "Auth controller", description = "Controladora responsável pela autenticação!")
public class AuthController {

    @Autowired
    private VeterinarioRepository veterinarioRepository;

    @Autowired
    private TokenService tokenService;

    @Autowired
    private VeterinarioService veterinarioService;

    @PostMapping("/login")
    @Operation(summary = "Login", description = "Método responsável por autenticar o veterinário!")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        if (request == null
                || request.email() == null
                || request.email().isBlank()
                || request.senha() == null
                || request.senha().isBlank()) {
            return ResponseEntity.badRequest().body("Email e senha são obrigatórios.");
        }

        if (veterinarioService.validaVeterinarioSenha(request)) {
            var vet = veterinarioRepository.findByEmail(request.email()).orElse(null);
            if (vet == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }

            var token = tokenService.gerarToken(request.email());
            return ResponseEntity.ok(buildLoginResponse(vet, token));
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    private LoginResponse buildLoginResponse(Veterinario vet, String token) {
        return new LoginResponse(
                token,
                new LoginResponse.Veterinario(
                        vet.getId(),
                        vet.getNome(),
                        vet.getCrmv(),
                        vet.getEspecialidade(),
                        vet.getTelefone(),
                        vet.getEmail()
                )
        );
    }

}