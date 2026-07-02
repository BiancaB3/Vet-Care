package VetCare.Back.presentation;

import VetCare.Back.application.DTO.AgendamentoRequest;
import VetCare.Back.application.DTO.AgendamentoResponse;
import VetCare.Back.domain.enuns.EnumStatusAgendamento;
import VetCare.Back.domain.entities.Agendamento;
import VetCare.Back.domain.repository.AgendamentoRepository;
import VetCare.Back.domain.repository.PetRepository;
import VetCare.Back.domain.repository.VeterinarioRepository;
import jakarta.validation.Valid;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Locale;

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
    public ResponseEntity<List<AgendamentoResponse>> listarTodos() {
        var veterinario = obterVeterinarioAutenticado();
        if (veterinario == null) {
            return ResponseEntity.status(401).build();
        }

        var resposta = agendamentoRepository.findByVeterinarioId(veterinario.getId())
                .stream()
                .map(this::toResponse)
                .toList();

        return ResponseEntity.ok(resposta);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Buscar agendamento por id", description = "Retorna um agendamento pelo identificador informado.")
    public ResponseEntity<AgendamentoResponse> buscarPorId(@PathVariable Long id) {
        var veterinario = obterVeterinarioAutenticado();
        if (veterinario == null) {
            return ResponseEntity.status(401).build();
        }

        var agendamento = agendamentoRepository.findByIdAndVeterinarioId(id, veterinario.getId());
        return agendamento.map(this::toResponse).map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    @Operation(summary = "Cadastrar agendamento", description = "Cadastra um novo agendamento no sistema.")
    public ResponseEntity<?> salvar(@Valid @RequestBody AgendamentoRequest agendamentoRequest) {
        var veterinario = obterVeterinarioAutenticado();
        if (veterinario == null) {
            return ResponseEntity.status(401).body("Veterinario nao autenticado.");
        }

        if (agendamentoRequest.pet() == null || agendamentoRequest.pet().id() == null) {
            return ResponseEntity.badRequest().body("Informe pet.id para salvar o agendamento.");
        }

        var pet = petRepository.findByIdAndTutorVeterinarioId(agendamentoRequest.pet().id(), veterinario.getId()).orElse(null);
        if (pet == null) {
            return ResponseEntity.badRequest().body("Pet informado nao existe para o veterinario autenticado.");
        }

        var agendamento = toEntity(agendamentoRequest);
        agendamento.setPet(pet);
        agendamento.setVeterinario(veterinario);
        return ResponseEntity.ok(toResponse(agendamentoRepository.save(agendamento)));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Atualizar agendamento", description = "Atualiza os dados de um agendamento existente.")
    public ResponseEntity<?> atualizar(@PathVariable Long id, @Valid @RequestBody AgendamentoRequest agendamentoRequest) {
        var veterinario = obterVeterinarioAutenticado();
        if (veterinario == null) {
            return ResponseEntity.status(401).body("Veterinario nao autenticado.");
        }

        var agendamentoBanco = agendamentoRepository.findByIdAndVeterinarioId(id, veterinario.getId()).orElse(null);
        if (agendamentoBanco == null) {
            return ResponseEntity.notFound().build();
        }

        if (agendamentoRequest.pet() == null || agendamentoRequest.pet().id() == null) {
            return ResponseEntity.badRequest().body("Informe pet.id para atualizar o agendamento.");
        }
        var pet = petRepository.findByIdAndTutorVeterinarioId(agendamentoRequest.pet().id(), veterinario.getId()).orElse(null);
        if (pet == null) {
            return ResponseEntity.badRequest().body("Pet informado nao existe para o veterinario autenticado.");
        }

        var agendamentoAtualizado = toEntity(agendamentoRequest);

        agendamentoBanco.setDataHora(agendamentoAtualizado.getDataHora());
        agendamentoBanco.setStatus(agendamentoAtualizado.getStatus());
        agendamentoBanco.setObservacoes(agendamentoAtualizado.getObservacoes());
        agendamentoBanco.setPet(pet);
        agendamentoBanco.setVeterinario(veterinario);

        return ResponseEntity.ok(toResponse(agendamentoRepository.save(agendamentoBanco)));
    }

    private Agendamento toEntity(AgendamentoRequest request) {
        var agendamento = new Agendamento();
        agendamento.setDataHora(request.dataHora());
        agendamento.setObservacoes(request.observacoes());

        var statusTexto = request.status() == null || request.status().isBlank()
                ? EnumStatusAgendamento.AGENDADO.name()
                : request.status().trim().toUpperCase(Locale.ROOT);

        try {
            agendamento.setStatus(EnumStatusAgendamento.valueOf(statusTexto));
        } catch (IllegalArgumentException ex) {
            throw new IllegalArgumentException("Status de agendamento invalido.");
        }

        return agendamento;
    }

    private AgendamentoResponse toResponse(Agendamento agendamento) {
        Long petId = null;
        if (agendamento.getPet() != null) {
            petId = agendamento.getPet().getId();
        }

        Long veterinarioId = null;
        if (agendamento.getVeterinario() != null) {
            veterinarioId = agendamento.getVeterinario().getId();
        }

        return new AgendamentoResponse(
                agendamento.getId(),
                petId,
                veterinarioId,
                agendamento.getDataHora(),
                agendamento.getObservacoes(),
                agendamento.getStatus() != null ? agendamento.getStatus().name() : null
        );
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

