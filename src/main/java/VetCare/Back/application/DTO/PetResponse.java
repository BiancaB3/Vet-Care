package VetCare.Back.application.DTO;

public record PetResponse(
        Long id,
        String nome,
        String especie,
        String raca,
        Integer idade,
        Double peso,
        String sexo,
        String cor,
        Long tutorId
) {
}
