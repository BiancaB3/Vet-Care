package VetCare.Back.model.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "veterinarios")
@Getter
@Setter
@NoArgsConstructor
@Schema(name = "Veterinario", description = "Entidade de veterinario usada para cadastro e login do sistema")
public class Veterinario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Schema(description = "Identificador do veterinario", example = "1", accessMode = Schema.AccessMode.READ_ONLY)
    private Long id;

    @Schema(description = "Nome do veterinario", example = "Bianca")
    private String nome;

    @Column(unique = true)
    @Schema(description = "Registro profissional do veterinario", example = "12345")
    private String crmv;

    @Schema(description = "Especialidade do veterinario", example = "Clinica Geral")
    private String especialidade;

    @Schema(description = "Telefone do veterinario", example = "11999999999")
    private String telefone;

    @Column(unique = true)
    @Schema(description = "Email usado no login do sistema", example = "bianca@vetcare.com")
    private String email;

    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    @Schema(description = "Senha de acesso do veterinario", example = "123456", accessMode = Schema.AccessMode.WRITE_ONLY)
    private String senha;

    @OneToMany(mappedBy = "veterinario")
    @JsonIgnore
    private List<Agendamento> agendamentos = new ArrayList<>();

    @OneToMany(mappedBy = "veterinario")
    @JsonIgnore
    private List<Prontuario> prontuarios = new ArrayList<>();
}


