package com.retread.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;
import java.time.LocalDateTime;

@Entity
@Data
@EqualsAndHashCode(exclude = "tire")
@ToString(exclude = "tire")
public class TireHistory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "tire_id")
    @JsonBackReference // Lado "Filho" da relação com Pneu
    private Tire tire;

    private String description;
    private String userName;
    private LocalDateTime timestamp;

    @Enumerated(EnumType.STRING)
    private TireStatus statusAtThatTime;
}
