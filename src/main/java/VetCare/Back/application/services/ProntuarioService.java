package VetCare.Back.application.services;

import VetCare.Back.application.DTO.ProntuarioRequest;
import VetCare.Back.application.DTO.ProntuarioResponse;
import VetCare.Back.domain.entities.Agendamento;
import VetCare.Back.domain.entities.Pet;
import VetCare.Back.domain.entities.Prontuario;
import VetCare.Back.domain.entities.Veterinario;
import VetCare.Back.domain.repository.AgendamentoRepository;
import VetCare.Back.domain.repository.PetRepository;
import VetCare.Back.domain.repository.ProntuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

@Service
public class ProntuarioService {

    @Autowired
    private ProntuarioRepository prontuarioRepository;

    @Autowired
    private PetRepository petRepository;

    @Autowired
    private AgendamentoRepository agendamentoRepository;

    public List<Prontuario> listarTodos(Long veterinarioId) {
        return prontuarioRepository.findByVeterinarioId(veterinarioId);
    }

    public List<ProntuarioResponse> listarTodosResponse(Long veterinarioId) {
        return listarTodos(veterinarioId).stream()
                .map(this::toResponse)
                .toList();
    }

    public Optional<Prontuario> buscarPorId(Long id, Long veterinarioId) {
        return prontuarioRepository.findByIdAndVeterinarioId(id, veterinarioId);
    }

    public ProntuarioResponse buscarPorIdResponse(Long id, Long veterinarioId) {
        return buscarPorId(id, veterinarioId)
                .map(this::toResponse)
                .orElse(null);
    }

    public ProntuarioResponse salvar(ProntuarioRequest prontuarioRequest, Veterinario veterinario) {
        validarProntuario(prontuarioRequest);

        var pet = buscarPetDoVeterinario(prontuarioRequest, veterinario);
        if (pet == null) {
            throw new IllegalArgumentException("Pet informado nao existe para o veterinario autenticado.");
        }

        var prontuario = toEntity(prontuarioRequest);
        prontuario.setPet(pet);
        prontuario.setVeterinario(veterinario);
        prontuario.setAgendamento(buscarAgendamentoOpcional(prontuarioRequest, veterinario));

        return toResponse(prontuarioRepository.save(prontuario));
    }

    public void atualizar(Long id, ProntuarioRequest prontuarioRequest, Veterinario veterinario) {
        validarProntuario(prontuarioRequest);

        var prontuarioBanco = prontuarioRepository.findByIdAndVeterinarioId(id, veterinario.getId())
                .orElseThrow(() -> new NoSuchElementException("Prontuario nao encontrado."));

        var pet = buscarPetDoVeterinario(prontuarioRequest, veterinario);
        if (pet == null) {
            throw new IllegalArgumentException("Pet informado nao existe para o veterinario autenticado.");
        }

        var prontuarioAtualizado = toEntity(prontuarioRequest);
        prontuarioBanco.setDataAtendimento(prontuarioAtualizado.getDataAtendimento());
        prontuarioBanco.setDescricao(prontuarioAtualizado.getDescricao());
        prontuarioBanco.setDiagnostico(prontuarioAtualizado.getDiagnostico());
        prontuarioBanco.setTratamento(prontuarioAtualizado.getTratamento());
        prontuarioBanco.setPrescricao(prontuarioAtualizado.getPrescricao());
        prontuarioBanco.setPet(pet);
        prontuarioBanco.setVeterinario(veterinario);
        prontuarioBanco.setAgendamento(buscarAgendamentoOpcional(prontuarioRequest, veterinario));

        prontuarioRepository.save(prontuarioBanco);
    }

    private Pet buscarPetDoVeterinario(ProntuarioRequest prontuarioRequest, Veterinario veterinario) {
        if (prontuarioRequest.pet() == null || prontuarioRequest.pet().id() == null) {
            throw new IllegalArgumentException("Informe pet.id para salvar o prontuario.");
        }

        return petRepository.findByIdAndTutorVeterinarioId(prontuarioRequest.pet().id(), veterinario.getId()).orElse(null);
    }

    private Agendamento buscarAgendamentoOpcional(ProntuarioRequest prontuarioRequest, Veterinario veterinario) {
        if (prontuarioRequest.agendamento() == null || prontuarioRequest.agendamento().id() == null) {
            return null;
        }

        var agendamento = agendamentoRepository.findByIdAndVeterinarioId(prontuarioRequest.agendamento().id(), veterinario.getId()).orElse(null);
        if (agendamento == null) {
            throw new IllegalArgumentException("Agendamento informado nao existe.");
        }

        return agendamento;
    }

    private void validarProntuario(ProntuarioRequest request) {
        if (request == null) {
            throw new IllegalArgumentException("Dados do prontuario nao informados.");
        }

        if (request.dataAtendimento() == null) {
            throw new IllegalArgumentException("Data do atendimento e obrigatoria.");
        }
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
}