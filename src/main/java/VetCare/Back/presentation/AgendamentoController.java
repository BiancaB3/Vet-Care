package VetCare.Back.presentation;

import VetCare.Back.application.DTO.AgendamentoRequest;
import VetCare.Back.application.DTO.AgendamentoResponse;
import VetCare.Back.application.services.AgendamentoService;
import VetCare.Back.domain.entities.Veterinario;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/agendamentos")
@Tag(name = "Agendamentos", description = "Endpoints para gerenciamento dos agendamentos do VetCare.")
public class AgendamentoController {

    @Autowired
    private AgendamentoService agendamentoService;

    @GetMapping
    @Operation(summary = "Listar agendamentos", description = "Retorna a lista de agendamentos cadastrados.")
    public ResponseEntity<List<AgendamentoResponse>> listarTodos(Authentication auth) {
        Veterinario veterinario = (Veterinario) auth.getPrincipal();

        return ResponseEntity.ok(agendamentoService.listarTodosResponse(veterinario.getId()));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Buscar agendamento por id", description = "Retorna um agendamento pelo identificador informado.")
    public ResponseEntity<AgendamentoResponse> buscarPorId(@PathVariable Long id, Authentication auth) {
        Veterinario veterinario = (Veterinario) auth.getPrincipal();

        return ResponseEntity.ok(agendamentoService.buscarPorIdResponse(id, veterinario.getId()));
    }

    @PostMapping
    @Operation(summary = "Cadastrar agendamento", description = "Cadastra um novo agendamento no sistema.")
    public ResponseEntity<AgendamentoResponse> salvar(@RequestBody AgendamentoRequest agendamentoRequest, Authentication auth) {
        Veterinario veterinario = (Veterinario) auth.getPrincipal();

        return ResponseEntity.status(HttpStatus.CREATED).body(agendamentoService.salvar(agendamentoRequest, veterinario));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Atualizar agendamento", description = "Atualiza os dados de um agendamento existente.")
    public ResponseEntity<?> atualizar(@PathVariable Long id, @RequestBody AgendamentoRequest agendamentoRequest, Authentication auth) {
        Veterinario veterinario = (Veterinario) auth.getPrincipal();

        agendamentoService.atualizar(id, agendamentoRequest, veterinario);
        return ResponseEntity.ok().build();
    }
}

