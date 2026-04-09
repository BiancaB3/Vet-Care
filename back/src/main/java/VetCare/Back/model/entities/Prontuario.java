package VetCare.Back.model.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "prontuarios")
@Getter
@Setter
@NoArgsConstructor
public class Prontuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "data_atendimento", nullable = false)
    private LocalDateTime dataAtendimento;

    @Column(columnDefinition = "TEXT")
    private String descricao;

    @Column(columnDefinition = "TEXT")
    private String diagnostico;

    @Column(columnDefinition = "TEXT")
    private String tratamento;

    @Column(columnDefinition = "TEXT")
    private String prescricao;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "pet_id", nullable = false)
    private Pet pet;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "veterinario_id", nullable = false)
    private Veterinario veterinario;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "agendamento_id", unique = true)
    private Agendamento agendamento;
}


