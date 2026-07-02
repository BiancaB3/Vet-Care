package VetCare.Back.presentation;

import VetCare.Back.application.DTO.ProntuarioRequest;
import VetCare.Back.application.DTO.ProntuarioResponse;
import VetCare.Back.domain.entities.Prontuario;
import VetCare.Back.domain.repository.AgendamentoRepository;
import VetCare.Back.domain.repository.PetRepository;
import VetCare.Back.domain.repository.ProntuarioRepository;
import VetCare.Back.domain.repository.VeterinarioRepository;
import jakarta.validation.Valid;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/prontuarios")
@Tag(name = "Prontuarios", description = "Endpoints para gerenciamento dos prontuarios do VetCare.")
public class ProntuarioController {

    @Autowired
    private ProntuarioRepository prontuarioRepository;

    @Autowired
    private PetRepository petRepository;

    @Autowired
    private VeterinarioRepository veterinarioRepository;

    @Autowired
    private AgendamentoRepository agendamentoRepository;

    @GetMapping
    @Operation(summary = "Listar prontuarios", description = "Retorna a lista de prontuarios cadastrados.")
    public ResponseEntity<List<ProntuarioResponse>> listarTodos() {
        var veterinario = obterVeterinarioAutenticado();
        if (veterinario == null) {
            return ResponseEntity.status(401).build();
        }

        var resposta = prontuarioRepository.findByVeterinarioId(veterinario.getId())
                .stream()
                .map(this::toResponse)
                .toList();

        return ResponseEntity.ok(resposta);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Buscar prontuario por id", description = "Retorna um prontuario pelo identificador informado.")
    public ResponseEntity<ProntuarioResponse> buscarPorId(@PathVariable Long id) {
        var veterinario = obterVeterinarioAutenticado();
        if (veterinario == null) {
            return ResponseEntity.status(401).build();
        }

        var prontuario = prontuarioRepository.findByIdAndVeterinarioId(id, veterinario.getId());
        return prontuario.map(this::toResponse).map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    @Operation(summary = "Cadastrar prontuario", description = "Cadastra um novo prontuario no sistema.")
    public ResponseEntity<?> salvar(@Valid @RequestBody ProntuarioRequest prontuarioRequest) {
        var veterinario = obterVeterinarioAutenticado();
        if (veterinario == null) {
            return ResponseEntity.status(401).body("Veterinario nao autenticado.");
        }

        if (prontuarioRequest.pet() == null || prontuarioRequest.pet().id() == null) {
            return ResponseEntity.badRequest().body("Informe pet.id para salvar o prontuario.");
        }

        var pet = petRepository.findByIdAndTutorVeterinarioId(prontuarioRequest.pet().id(), veterinario.getId()).orElse(null);
        if (pet == null) {
            return ResponseEntity.badRequest().body("Pet informado nao existe para o veterinario autenticado.");
        }

        var prontuario = toEntity(prontuarioRequest);

        prontuario.setPet(pet);
        prontuario.setVeterinario(veterinario);

        if (prontuarioRequest.agendamento() != null && prontuarioRequest.agendamento().id() != null) {
            var agendamento = agendamentoRepository
                    .findByIdAndVeterinarioId(prontuarioRequest.agendamento().id(), veterinario.getId())
                    .orElse(null);
            if (agendamento == null) {
                return ResponseEntity.badRequest().body("Agendamento informado nao existe.");
            }
            prontuario.setAgendamento(agendamento);
        } else {
            prontuario.setAgendamento(null);
        }

        return ResponseEntity.ok(toResponse(prontuarioRepository.save(prontuario)));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Atualizar prontuario", description = "Atualiza os dados de um prontuario existente.")
    public ResponseEntity<?> atualizar(@PathVariable Long id, @Valid @RequestBody ProntuarioRequest prontuarioRequest) {
        var veterinario = obterVeterinarioAutenticado();
        if (veterinario == null) {
            return ResponseEntity.status(401).body("Veterinario nao autenticado.");
        }

        var prontuarioBanco = prontuarioRepository.findByIdAndVeterinarioId(id, veterinario.getId()).orElse(null);
        if (prontuarioBanco == null) {
            return ResponseEntity.notFound().build();
        }

        if (prontuarioRequest.pet() == null || prontuarioRequest.pet().id() == null) {
            return ResponseEntity.badRequest().body("Informe pet.id para atualizar o prontuario.");
        }
        var pet = petRepository.findByIdAndTutorVeterinarioId(prontuarioRequest.pet().id(), veterinario.getId()).orElse(null);
        if (pet == null) {
            return ResponseEntity.badRequest().body("Pet informado nao existe para o veterinario autenticado.");
        }

        var prontuarioAtualizado = toEntity(prontuarioRequest);

        prontuarioBanco.setDataAtendimento(prontuarioAtualizado.getDataAtendimento());
        prontuarioBanco.setDescricao(prontuarioAtualizado.getDescricao());
        prontuarioBanco.setDiagnostico(prontuarioAtualizado.getDiagnostico());
        prontuarioBanco.setTratamento(prontuarioAtualizado.getTratamento());
        prontuarioBanco.setPrescricao(prontuarioAtualizado.getPrescricao());
        prontuarioBanco.setPet(pet);
        prontuarioBanco.setVeterinario(veterinario);

        if (prontuarioRequest.agendamento() != null && prontuarioRequest.agendamento().id() != null) {
            var agendamento = agendamentoRepository
                    .findByIdAndVeterinarioId(prontuarioRequest.agendamento().id(), veterinario.getId())
                    .orElse(null);
            if (agendamento == null) {
                return ResponseEntity.badRequest().body("Agendamento informado nao existe.");
            }
            prontuarioBanco.setAgendamento(agendamento);
        } else {
            prontuarioBanco.setAgendamento(null);
        }

        return ResponseEntity.ok(toResponse(prontuarioRepository.save(prontuarioBanco)));
    }

    private Prontuario toEntity(ProntuarioRequest request) {
        var prontuario = new Prontuario();
        prontuario.setDataAtendimento(request.dataAtendimento());
        prontuario.setDescricao(request.descricao());
        prontuario.setDiagnostico(request.diagnostico());
        prontuario.setTratamento(request.tratamento());
        prontuario.setPrescricao(request.prescricao());
        return prontuario;
    }

    private ProntuarioResponse toResponse(Prontuario prontuario) {
        Long petId = null;
        if (prontuario.getPet() != null) {
            petId = prontuario.getPet().getId();
        }

        Long veterinarioId = null;
        if (prontuario.getVeterinario() != null) {
            veterinarioId = prontuario.getVeterinario().getId();
        }

        Long agendamentoId = null;
        if (prontuario.getAgendamento() != null) {
            agendamentoId = prontuario.getAgendamento().getId();
        }

        return new ProntuarioResponse(
                prontuario.getId(),
                petId,
                veterinarioId,
                agendamentoId,
                prontuario.getDataAtendimento(),
                prontuario.getDescricao(),
                prontuario.getDiagnostico(),
                prontuario.getTratamento(),
                prontuario.getPrescricao()
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

