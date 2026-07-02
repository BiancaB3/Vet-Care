package VetCare.Back.application.DTO;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record TutorRequest(
        @NotBlank(message = "Nome do tutor e obrigatorio.")
        String nome,

        @NotBlank(message = "Email do tutor e obrigatorio.")
        @Email(message = "Email do tutor invalido.")
        String email,

        @NotBlank(message = "Telefone do tutor e obrigatorio.")
        String telefone,

        @NotBlank(message = "CPF do tutor e obrigatorio.")
        @Pattern(regexp = "\\d{11}", message = "CPF invalido. Informe um CPF valido com 11 digitos.")
        String cpf,

        @NotBlank(message = "CEP do tutor e obrigatorio.")
        @Pattern(regexp = "\\d{8}", message = "CEP invalido. Informe um CEP valido com 8 digitos.")
        String cep,

        String endereco,
        String status
) {
}
