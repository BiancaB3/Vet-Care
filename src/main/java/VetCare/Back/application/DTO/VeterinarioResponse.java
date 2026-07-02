package VetCare.Back.application.DTO;

public record VeterinarioResponse(
        Long id,
        String nome,
        String crmv,
        String especialidade,
        String telefone,
        String email
) {
}
