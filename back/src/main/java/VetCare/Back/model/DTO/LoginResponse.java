package VetCare.Back.model.DTO;

public record LoginResponse(String token, Veterinario veterinario) {

    public record Veterinario(Long id, String nome, String crmv, String especialidade, String telefone, String email) {
    }
}
