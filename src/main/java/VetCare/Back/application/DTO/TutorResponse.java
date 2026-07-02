package VetCare.Back.application.DTO;

public record TutorResponse(
        Long id,
        String nome,
        String email,
        String telefone,
        String cpf,
        String cep,
        String endereco,
        String status
) {
}
