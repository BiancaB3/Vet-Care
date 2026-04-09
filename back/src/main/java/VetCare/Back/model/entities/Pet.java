package VetCare.Back.model.entities;

import VetCare.Back.model.enuns.EnumSexoPet;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "pets")
@Getter
@Setter
@NoArgsConstructor
public class Pet {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome;
    private String especie;
    private String raca;
    private Integer idade;
    private BigDecimal peso;

    @Enumerated(EnumType.STRING)
    private EnumSexoPet sexo = EnumSexoPet.NAO_INFORMADO;

    private String cor;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "tutor_id", nullable = false)
    private Tutor tutor;

    @OneToMany(mappedBy = "pet", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<Agendamento> agendamentos = new ArrayList<>();

    @OneToMany(mappedBy = "pet", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<Prontuario> prontuarios = new ArrayList<>();
}


