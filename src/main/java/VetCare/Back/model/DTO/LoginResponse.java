package VetCare.Back.model.DTO;

import io.swagger.v3.oas.annotations.media.Schema;

public record LoginResponse(
		@Schema(description = "Token simples de retorno do login", example = "login-ok-1")
		String token) {
}

