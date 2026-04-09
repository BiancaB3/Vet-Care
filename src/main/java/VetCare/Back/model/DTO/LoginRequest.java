package VetCare.Back.model.DTO;

import io.swagger.v3.oas.annotations.media.Schema;

public record LoginRequest(
		@Schema(description = "Email do veterinario", example = "bianca@vetcare.com")
		String email,
		@Schema(description = "Senha do veterinario", example = "123456")
		String senha) {
}

