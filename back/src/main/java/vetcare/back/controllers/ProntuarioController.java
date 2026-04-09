package vetcare.back.controllers;

import vetcare.back.model.entities.Prontuario;
import vetcare.back.model.repository.AgendamentoRepository;
import vetcare.back.model.repository.PetRepository;
import vetcare.back.model.repository.ProntuarioRepository;
import vetcare.back.model.repository.VeterinarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/prontuarios")
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
    public ResponseEntity<List<Prontuario>> listarTodos() {
        return ResponseEntity.ok(prontuarioRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Prontuario> buscarPorId(@PathVariable Long id) {
        var prontuario = prontuarioRepository.findById(id);
        return prontuario.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> salvar(@RequestBody Prontuario prontuario) {
        if (prontuario.getPet() == null || prontuario.getPet().getId() == null) {
            return ResponseEntity.badRequest().body("Informe pet.id para salvar o prontuario.");
        }
        if (prontuario.getVeterinario() == null || prontuario.getVeterinario().getId() == null) {
            return ResponseEntity.badRequest().body("Informe veterinario.id para salvar o prontuario.");
        }

        var pet = petRepository.findById(prontuario.getPet().getId()).orElse(null);
        var veterinario = veterinarioRepository.findById(prontuario.getVeterinario().getId()).orElse(null);
        if (pet == null || veterinario == null) {
            return ResponseEntity.badRequest().body("Pet ou Veterinario informado nao existe.");
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
    public ResponseEntity<?> atualizar(@PathVariable Long id, @RequestBody Prontuario prontuario) {
        var prontuarioBanco = prontuarioRepository.findById(id).orElse(null);
        if (prontuarioBanco == null) {
            return ResponseEntity.notFound().build();
        }

        if (prontuario.getPet() == null || prontuario.getPet().getId() == null) {
            return ResponseEntity.badRequest().body("Informe pet.id para atualizar o prontuario.");
        }
        if (prontuario.getVeterinario() == null || prontuario.getVeterinario().getId() == null) {
            return ResponseEntity.badRequest().body("Informe veterinario.id para atualizar o prontuario.");
        }

        var pet = petRepository.findById(prontuario.getPet().getId()).orElse(null);
        var veterinario = veterinarioRepository.findById(prontuario.getVeterinario().getId()).orElse(null);
        if (pet == null || veterinario == null) {
            return ResponseEntity.badRequest().body("Pet ou Veterinario informado nao existe.");
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

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        if (!prontuarioRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        prontuarioRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
