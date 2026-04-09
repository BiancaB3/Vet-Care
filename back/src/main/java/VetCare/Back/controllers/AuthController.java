package VetCare.Back.controllers;

import VetCare.Back.model.entities.Veterinario;
import VetCare.Back.model.repository.VeterinarioRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@Tag(name = "Auth controller", description = "Controladora responsável pela autenticação!")
public class AuthController {

    @Autowired
    private VeterinarioRepository veterinarioRepository;

    @PostMapping("/login")
    @Operation(summary = "Login", description = "Método responsável por autenticar o veterinário!")
    public ResponseEntity<?> login(@RequestBody Veterinario veterinario) {
        var vet = veterinarioRepository.findByEmail(veterinario.getEmail()).orElse(null);
        if (vet == null || !vet.getSenha().equals(veterinario.getSenha())) {
            return ResponseEntity.status(401).body("Email ou senha inválidos!");
        }
        return ResponseEntity.ok(vet);
    }
}