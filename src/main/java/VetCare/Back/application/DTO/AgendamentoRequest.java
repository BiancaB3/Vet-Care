package VetCare.Back.application.DTO;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

public record AgendamentoRequest(
        @NotNull(message = "Data e hora do agendamento sao obrigatorias.")
        LocalDateTime dataHora,

        String observacoes,
        String status,

        @NotNull(message = "Pet do agendamento e obrigatorio.")
        @Valid
        PetRef pet
) {
    public record PetRef(
            @NotNull(message = "Informe pet.id para salvar o agendamento.")
            Long id
    ) {
    }
}
