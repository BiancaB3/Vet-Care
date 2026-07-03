package VetCare.Back.application.services;

import VetCare.Back.application.DTO.AgendamentoRequest;
import VetCare.Back.application.DTO.AgendamentoResponse;
import VetCare.Back.domain.entities.Agendamento;
import VetCare.Back.domain.entities.Pet;
import VetCare.Back.domain.entities.Veterinario;
import VetCare.Back.domain.enuns.EnumStatusAgendamento;
import VetCare.Back.domain.repository.AgendamentoRepository;
import VetCare.Back.domain.repository.PetRepository;
import VetCare.Back.domain.repository.ProntuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Locale;
import java.util.Optional;

@Service
public class AgendamentoService {

    @Autowired
    private AgendamentoRepository agendamentoRepository;

    @Autowired
    private PetRepository petRepository;

    @Autowired
    private ProntuarioRepository prontuarioRepository;

    public List<Agendamento> listarTodos(Long veterinarioId) {
        return agendamentoRepository.findByVeterinarioId(veterinarioId);
    }

    public List<AgendamentoResponse> listarTodosResponse(Long veterinarioId) {
        return listarTodos(veterinarioId).stream()
                .map(this::toResponse)
                .toList();
    }

    public Optional<Agendamento> buscarPorId(Long id, Long veterinarioId) {
        return agendamentoRepository.findByIdAndVeterinarioId(id, veterinarioId);
    }

    public AgendamentoResponse buscarPorIdResponse(Long id, Long veterinarioId) {
        return buscarPorId(id, veterinarioId)
                .map(this::toResponse)
                .orElse(null);
    }

    public AgendamentoResponse salvar(AgendamentoRequest agendamentoRequest, Veterinario veterinario) {
        validarAgendamento(agendamentoRequest);

        var pet = buscarPetDoVeterinario(agendamentoRequest, veterinario);
        if (pet == null) {
            throw new IllegalArgumentException("Pet informado nao existe para o veterinario autenticado.");
        }

        var agendamento = toEntity(agendamentoRequest);
        agendamento.setPet(pet);
        agendamento.setVeterinario(veterinario);
        return toResponse(agendamentoRepository.save(agendamento));
    }

    public boolean atualizar(Long id, AgendamentoRequest agendamentoRequest, Veterinario veterinario) {
        validarAgendamento(agendamentoRequest);

        var agendamentoBanco = agendamentoRepository.findByIdAndVeterinarioId(id, veterinario.getId()).orElse(null);
        if (agendamentoBanco != null) {
            var pet = buscarPetDoVeterinario(agendamentoRequest, veterinario);
            if (pet == null) {
                throw new IllegalArgumentException("Pet informado nao existe para o veterinario autenticado.");
            }

            var agendamentoAtualizado = toEntity(agendamentoRequest);
            agendamentoBanco.setDataHora(agendamentoAtualizado.getDataHora());
            agendamentoBanco.setStatus(agendamentoAtualizado.getStatus());
            agendamentoBanco.setObservacoes(agendamentoAtualizado.getObservacoes());
            agendamentoBanco.setPet(pet);
            agendamentoBanco.setVeterinario(veterinario);

            agendamentoRepository.save(agendamentoBanco);
            return true;
        }

        return false;
    }

    @Transactional
    public boolean excluir(Long id, Veterinario veterinario) {
        var agendamento = agendamentoRepository.findByIdAndVeterinarioId(id, veterinario.getId()).orElse(null);
        if (agendamento == null) {
            return false;
        }

        var prontuariosVinculados = prontuarioRepository.findByAgendamentoId(id);
        prontuariosVinculados.forEach(prontuario -> prontuario.setAgendamento(null));
        prontuarioRepository.saveAll(prontuariosVinculados);

        agendamentoRepository.delete(agendamento);
        return true;
    }

    private Pet buscarPetDoVeterinario(AgendamentoRequest agendamentoRequest, Veterinario veterinario) {
        if (agendamentoRequest.pet() == null || agendamentoRequest.pet().id() == null) {
            throw new IllegalArgumentException("Informe pet.id para salvar o agendamento.");
        }

        return petRepository.findByIdAndTutorVeterinarioId(agendamentoRequest.pet().id(), veterinario.getId()).orElse(null);
    }

    private void validarAgendamento(AgendamentoRequest request) {
        if (request == null) {
            throw new IllegalArgumentException("Dados do agendamento nao informados.");
        }

        if (request.dataHora() == null) {
            throw new IllegalArgumentException("Data e hora do agendamento sao obrigatorias.");
        }
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
}