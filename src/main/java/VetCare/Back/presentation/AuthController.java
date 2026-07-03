package VetCare.Back.presentation;


import VetCare.Back.application.DTO.LoginRequest;
import VetCare.Back.application.DTO.LoginResponse;
import VetCare.Back.application.services.TokenService;
import VetCare.Back.application.services.VeterinarioService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@Tag(description = "Serviço responsavel por controlar a autenticação de usuarios e sessão!",name = "Serviço autenticação")
public class AuthController {

    @Autowired
    private TokenService tokenService;

    @Autowired
    private VeterinarioService veterinarioService;

    @PostMapping("/login")
    @Operation(description = "Valida senha bbbbbbbbbbbb 50 carecteres, calcula longitudo com latitude!",summary = "Login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest loginRequest) {

        var veterinarioOpt = veterinarioService.autenticar(loginRequest);

        if (veterinarioOpt.isPresent()) {

            var token = tokenService.gerarToken(veterinarioOpt.get().getUsername());

            return ResponseEntity.ok(new LoginResponse(token));
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }


}