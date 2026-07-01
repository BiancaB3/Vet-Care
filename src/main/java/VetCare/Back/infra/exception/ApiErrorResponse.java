package VetCare.Back.infra.exception;

import java.time.LocalDateTime;

public record ApiErrorResponse(
        LocalDateTime timestamp,
        int status,
        String mensagem,
        String path
) {
}
