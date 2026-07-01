package VetCare.Back.presentation;

import VetCare.Back.domain.entities.Agendamento;
import VetCare.Back.domain.repository.AgendamentoRepository;
import VetCare.Back.domain.repository.PetRepository;
import VetCare.Back.domain.repository.VeterinarioRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/agendamentos")
@Tag(name = "Agendamentos", description = "Endpoints para gerenciamento dos agendamentos do VetCare.")
public class AgendamentoController {

    @Autowired
    private AgendamentoRepository agendamentoRepository;

    @Autowired
    private PetRepository petRepository;

    @Autowired
    private VeterinarioRepository veterinarioRepository;

    @GetMapping
    @Operation(summary = "Listar agendamentos", description = "Retorna a lista de agendamentos cadastrados.")
    public ResponseEntity<List<Agendamento>> listarTodos() {
        return ResponseEntity.ok(agendamentoRepository.findAll());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Buscar agendamento por id", description = "Retorna um agendamento pelo identificador informado.")
    public ResponseEntity<Agendamento> buscarPorId(@PathVariable Long id) {
        var agendamento = agendamentoRepository.findById(id);
        return agendamento.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    @Operation(summary = "Cadastrar agendamento", description = "Cadastra um novo agendamento no sistema.")
    public ResponseEntity<?> salvar(@RequestBody Agendamento agendamento) {
        if (agendamento.getPet() == null || agendamento.getPet().getId() == null) {
            return ResponseEntity.badRequest().body("Informe pet.id para salvar o agendamento.");
        }
        if (agendamento.getVeterinario() == null || agendamento.getVeterinario().getId() == null) {
            return ResponseEntity.badRequest().body("Informe veterinario.id para salvar o agendamento.");
        }

        var pet = petRepository.findById(agendamento.getPet().getId()).orElse(null);
        var veterinario = veterinarioRepository.findById(agendamento.getVeterinario().getId()).orElse(null);
        if (pet == null || veterinario == null) {
            return ResponseEntity.badRequest().body("Pet ou Veterinario informado nao existe.");
        }

        agendamento.setPet(pet);
        agendamento.setVeterinario(veterinario);
        return ResponseEntity.ok(agendamentoRepository.save(agendamento));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Atualizar agendamento", description = "Atualiza os dados de um agendamento existente.")
    public ResponseEntity<?> atualizar(@PathVariable Long id, @RequestBody Agendamento agendamento) {
        var agendamentoBanco = agendamentoRepository.findById(id).orElse(null);
        if (agendamentoBanco == null) {
            return ResponseEntity.notFound().build();
        }

        if (agendamento.getPet() == null || agendamento.getPet().getId() == null) {
            return ResponseEntity.badRequest().body("Informe pet.id para atualizar o agendamento.");
        }
        if (agendamento.getVeterinario() == null || agendamento.getVeterinario().getId() == null) {
            return ResponseEntity.badRequest().body("Informe veterinario.id para atualizar o agendamento.");
        }

        var pet = petRepository.findById(agendamento.getPet().getId()).orElse(null);
        var veterinario = veterinarioRepository.findById(agendamento.getVeterinario().getId()).orElse(null);
        if (pet == null || veterinario == null) {
            return ResponseEntity.badRequest().body("Pet ou Veterinario informado nao existe.");
        }

        agendamentoBanco.setDataHora(agendamento.getDataHora());
        agendamentoBanco.setStatus(agendamento.getStatus());
        agendamentoBanco.setObservacoes(agendamento.getObservacoes());
        agendamentoBanco.setPet(pet);
        agendamentoBanco.setVeterinario(veterinario);

        return ResponseEntity.ok(agendamentoRepository.save(agendamentoBanco));
    }
}

