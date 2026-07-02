package VetCare.Back.application.DTO;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record VeterinarioCadastroRequest(
        @NotBlank(message = "Nome do veterinario e obrigatorio.")
        String nome,

        @NotBlank(message = "CRMV do veterinario e obrigatorio.")
        String crmv,

        String especialidade,
        String telefone,

        @NotBlank(message = "Email do veterinario e obrigatorio.")
        @Email(message = "Email do veterinario invalido.")
        String email,

        @NotBlank(message = "Senha do veterinario e obrigatoria.")
        String senha
) {
}
