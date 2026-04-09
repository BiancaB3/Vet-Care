package VetCare.Back.controllers;


import VetCare.Back.model.DTO.LoginRequest;
import VetCare.Back.model.DTO.LoginResponse;
import VetCare.Back.model.repository.VeterinarioRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@Tag(name = "Autenticacao", description = "Endpoints de autenticacao do sistema")
public class AuthController {

    @Autowired
    private VeterinarioRepository veterinarioRepository;

    @PostMapping("/login")
    @Operation(summary = "Realiza login do veterinario", description = "Autentica o veterinario cadastrado usando email e senha salvos no banco")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest){

        var veterinario = veterinarioRepository.findByEmail(loginRequest.email()).orElse(null);

        if (veterinario == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Email nao encontrado.");
        }

        if (veterinario.getSenha() == null || !veterinario.getSenha().equals(loginRequest.senha())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Senha invalida.");
        }

        return ResponseEntity.ok(new LoginResponse("login-ok-" + veterinario.getId()));
    }


}

