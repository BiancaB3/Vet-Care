package VetCare.Back.model.DTO;

public record LoginResponse(String token, Usuario usuario) {

    public record Usuario(Long id, String nome, String crmv, String especialidade, String telefone, String email) {
    }
}
