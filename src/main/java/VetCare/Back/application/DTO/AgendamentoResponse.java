package VetCare.Back.application.DTO;

import java.time.LocalDateTime;

public record AgendamentoResponse(
        Long id,
        Long petId,
        Long veterinarioId,
        LocalDateTime dataHora,
        String observacoes,
        String status
) {
}
