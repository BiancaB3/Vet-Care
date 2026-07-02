package VetCare.Back.application.DTO;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

public record PetRequest(
        @NotBlank(message = "Nome do pet e obrigatorio.")
        String nome,

        @NotBlank(message = "Especie do pet e obrigatoria.")
        String especie,

        String raca,

        @PositiveOrZero(message = "Idade do pet nao pode ser negativa.")
        Integer idade,

        @PositiveOrZero(message = "Peso do pet nao pode ser negativo.")
        Double peso,

        @NotBlank(message = "Sexo do pet e obrigatorio.")
        String sexo,

        @NotBlank(message = "Cor do pet e obrigatoria.")
        String cor,

        @NotNull(message = "Tutor do pet e obrigatorio.")
        @Valid
        TutorRef tutor
) {
    public record TutorRef(
            @NotNull(message = "Informe tutor.id para salvar o pet.")
            Long id
    ) {
    }
}
