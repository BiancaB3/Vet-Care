package VetCare.Back.application.DTO;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

public record ProntuarioRequest(
        @NotNull(message = "Data do atendimento e obrigatoria.")
        LocalDateTime dataAtendimento,

        String descricao,
        String diagnostico,
        String tratamento,
        String prescricao,

        @NotNull(message = "Pet do prontuario e obrigatorio.")
        @Valid
        PetRef pet,

        @Valid
        AgendamentoRef agendamento
) {
    public record PetRef(
            @NotNull(message = "Informe pet.id para salvar o prontuario.")
            Long id
    ) {
    }

    public record AgendamentoRef(
            Long id
    ) {
    }
}
