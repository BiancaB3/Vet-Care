package VetCare.Back.presentation;

import VetCare.Back.domain.entities.Agendamento;
import VetCare.Back.domain.repository.AgendamentoRepository;
import VetCare.Back.domain.repository.PetRepository;
import VetCare.Back.domain.repository.VeterinarioRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
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
        var veterinario = obterVeterinarioAutenticado();
        if (veterinario == null) {
            return ResponseEntity.status(401).build();
        }

        return ResponseEntity.ok(agendamentoRepository.findByVeterinarioId(veterinario.getId()));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Buscar agendamento por id", description = "Retorna um agendamento pelo identificador informado.")
    public ResponseEntity<Agendamento> buscarPorId(@PathVariable Long id) {
        var veterinario = obterVeterinarioAutenticado();
        if (veterinario == null) {
            return ResponseEntity.status(401).build();
        }

        var agendamento = agendamentoRepository.findByIdAndVeterinarioId(id, veterinario.getId());
        return agendamento.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    @Operation(summary = "Cadastrar agendamento", description = "Cadastra um novo agendamento no sistema.")
    public ResponseEntity<?> salvar(@RequestBody Agendamento agendamento) {
        var veterinario = obterVeterinarioAutenticado();
        if (veterinario == null) {
            return ResponseEntity.status(401).body("Veterinario nao autenticado.");
        }

        if (agendamento.getPet() == null || agendamento.getPet().getId() == null) {
            return ResponseEntity.badRequest().body("Informe pet.id para salvar o agendamento.");
        }

        var pet = petRepository.findByIdAndTutorVeterinarioId(agendamento.getPet().getId(), veterinario.getId()).orElse(null);
        if (pet == null) {
            return ResponseEntity.badRequest().body("Pet informado nao existe para o veterinario autenticado.");
        }

        agendamento.setPet(pet);
        agendamento.setVeterinario(veterinario);
        return ResponseEntity.ok(agendamentoRepository.save(agendamento));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Atualizar agendamento", description = "Atualiza os dados de um agendamento existente.")
    public ResponseEntity<?> atualizar(@PathVariable Long id, @RequestBody Agendamento agendamento) {
        var veterinario = obterVeterinarioAutenticado();
        if (veterinario == null) {
            return ResponseEntity.status(401).body("Veterinario nao autenticado.");
        }

        var agendamentoBanco = agendamentoRepository.findByIdAndVeterinarioId(id, veterinario.getId()).orElse(null);
        if (agendamentoBanco == null) {
            return ResponseEntity.notFound().build();
        }

        if (agendamento.getPet() == null || agendamento.getPet().getId() == null) {
            return ResponseEntity.badRequest().body("Informe pet.id para atualizar o agendamento.");
        }
        var pet = petRepository.findByIdAndTutorVeterinarioId(agendamento.getPet().getId(), veterinario.getId()).orElse(null);
        if (pet == null) {
            return ResponseEntity.badRequest().body("Pet informado nao existe para o veterinario autenticado.");
        }

        agendamentoBanco.setDataHora(agendamento.getDataHora());
        agendamentoBanco.setStatus(agendamento.getStatus());
        agendamentoBanco.setObservacoes(agendamento.getObservacoes());
        agendamentoBanco.setPet(pet);
        agendamentoBanco.setVeterinario(veterinario);

        return ResponseEntity.ok(agendamentoRepository.save(agendamentoBanco));
    }

    private VetCare.Back.domain.entities.Veterinario obterVeterinarioAutenticado() {
        Authentication authentication = org.springframework.security.core.context.SecurityContextHolder
                .getContext()
                .getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()) {
            return null;
        }

        var principal = authentication.getPrincipal();
        if (principal instanceof VetCare.Back.domain.entities.Veterinario veterinario) {
            return veterinario;
        }

        return veterinarioRepository.findByEmail(authentication.getName()).orElse(null);
    }
}

