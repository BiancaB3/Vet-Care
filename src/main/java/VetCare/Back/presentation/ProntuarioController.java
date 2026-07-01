package VetCare.Back.presentation;

import VetCare.Back.domain.entities.Prontuario;
import VetCare.Back.domain.repository.AgendamentoRepository;
import VetCare.Back.domain.repository.PetRepository;
import VetCare.Back.domain.repository.ProntuarioRepository;
import VetCare.Back.domain.repository.VeterinarioRepository;
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
    public ResponseEntity<List<Prontuario>> listarTodos() {
        var veterinario = obterVeterinarioAutenticado();
        if (veterinario == null) {
            return ResponseEntity.status(401).build();
        }

        return ResponseEntity.ok(prontuarioRepository.findByVeterinarioId(veterinario.getId()));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Buscar prontuario por id", description = "Retorna um prontuario pelo identificador informado.")
    public ResponseEntity<Prontuario> buscarPorId(@PathVariable Long id) {
        var veterinario = obterVeterinarioAutenticado();
        if (veterinario == null) {
            return ResponseEntity.status(401).build();
        }

        var prontuario = prontuarioRepository.findByIdAndVeterinarioId(id, veterinario.getId());
        return prontuario.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    @Operation(summary = "Cadastrar prontuario", description = "Cadastra um novo prontuario no sistema.")
    public ResponseEntity<?> salvar(@RequestBody Prontuario prontuario) {
        var veterinario = obterVeterinarioAutenticado();
        if (veterinario == null) {
            return ResponseEntity.status(401).body("Veterinario nao autenticado.");
        }

        if (prontuario.getPet() == null || prontuario.getPet().getId() == null) {
            return ResponseEntity.badRequest().body("Informe pet.id para salvar o prontuario.");
        }

        var pet = petRepository.findByIdAndTutorVeterinarioId(prontuario.getPet().getId(), veterinario.getId()).orElse(null);
        if (pet == null) {
            return ResponseEntity.badRequest().body("Pet informado nao existe para o veterinario autenticado.");
        }

        prontuario.setPet(pet);
        prontuario.setVeterinario(veterinario);

        if (prontuario.getAgendamento() != null && prontuario.getAgendamento().getId() != null) {
            var agendamento = agendamentoRepository.findById(prontuario.getAgendamento().getId()).orElse(null);
            if (agendamento == null) {
                return ResponseEntity.badRequest().body("Agendamento informado nao existe.");
            }
            prontuario.setAgendamento(agendamento);
        } else {
            prontuario.setAgendamento(null);
        }

        return ResponseEntity.ok(prontuarioRepository.save(prontuario));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Atualizar prontuario", description = "Atualiza os dados de um prontuario existente.")
    public ResponseEntity<?> atualizar(@PathVariable Long id, @RequestBody Prontuario prontuario) {
        var veterinario = obterVeterinarioAutenticado();
        if (veterinario == null) {
            return ResponseEntity.status(401).body("Veterinario nao autenticado.");
        }

        var prontuarioBanco = prontuarioRepository.findByIdAndVeterinarioId(id, veterinario.getId()).orElse(null);
        if (prontuarioBanco == null) {
            return ResponseEntity.notFound().build();
        }

        if (prontuario.getPet() == null || prontuario.getPet().getId() == null) {
            return ResponseEntity.badRequest().body("Informe pet.id para atualizar o prontuario.");
        }
        var pet = petRepository.findByIdAndTutorVeterinarioId(prontuario.getPet().getId(), veterinario.getId()).orElse(null);
        if (pet == null) {
            return ResponseEntity.badRequest().body("Pet informado nao existe para o veterinario autenticado.");
        }

        prontuarioBanco.setDataAtendimento(prontuario.getDataAtendimento());
        prontuarioBanco.setDescricao(prontuario.getDescricao());
        prontuarioBanco.setDiagnostico(prontuario.getDiagnostico());
        prontuarioBanco.setTratamento(prontuario.getTratamento());
        prontuarioBanco.setPrescricao(prontuario.getPrescricao());
        prontuarioBanco.setPet(pet);
        prontuarioBanco.setVeterinario(veterinario);

        if (prontuario.getAgendamento() != null && prontuario.getAgendamento().getId() != null) {
            var agendamento = agendamentoRepository.findById(prontuario.getAgendamento().getId()).orElse(null);
            if (agendamento == null) {
                return ResponseEntity.badRequest().body("Agendamento informado nao existe.");
            }
            prontuarioBanco.setAgendamento(agendamento);
        } else {
            prontuarioBanco.setAgendamento(null);
        }

        return ResponseEntity.ok(prontuarioRepository.save(prontuarioBanco));
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

