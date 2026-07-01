package VetCare.Back.presentation;

import VetCare.Back.application.services.EnderecoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;
import java.util.NoSuchElementException;

@RestController
@RequestMapping("/api/enderecos")
@Tag(name = "Enderecos", description = "Endpoints para consulta de endereco por CEP.")
public class EnderecoController {

    private final EnderecoService enderecoService;

    public EnderecoController(EnderecoService enderecoService) {
        this.enderecoService = enderecoService;
    }

    @GetMapping("/{cep}")
    @Operation(summary = "Consultar endereco por CEP", description = "Consulta os dados de endereco a partir de um CEP valido.")
    public ResponseEntity<?> buscarPorCep(@PathVariable String cep) {
        try {
            return ResponseEntity.ok(enderecoService.buscarPorCep(cep));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(Map.of("mensagem", ex.getMessage()));
        } catch (NoSuchElementException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("mensagem", ex.getMessage()));
        } catch (IllegalStateException ex) {
            return ResponseEntity.badRequest().body(Map.of("mensagem", ex.getMessage()));
        }
    }
}