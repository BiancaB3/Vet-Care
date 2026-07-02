package VetCare.Back.application.DTO;

import java.time.LocalDateTime;

public record ProntuarioResponse(
        Long id,
        Long petId,
        Long veterinarioId,
        Long agendamentoId,
        LocalDateTime dataAtendimento,
        String descricao,
        String diagnostico,
        String tratamento,
        String prescricao
) {
}
