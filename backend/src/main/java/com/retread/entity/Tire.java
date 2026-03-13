package com.retread.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@EqualsAndHashCode(exclude = {"serviceOrder", "history"})
@ToString(exclude = {"serviceOrder", "history"})
public class Tire {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "order_id")
    @JsonBackReference // Lado "Filho" da relação com Ordem
    private ServiceOrder serviceOrder;

    private String brand;
    private String model;
    private String size;
    private String serialNumber;
    private String licensePlate;
    private Integer dot;
    
    @Enumerated(EnumType.STRING)
    private TireStatus status;

    private String observation;
    
    private LocalDateTime lastUpdate;

    @OneToMany(mappedBy = "tire", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference // Lado "Pai" da relação com Histórico
    private List<TireHistory> history = new ArrayList<>();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tenant_id", nullable = false)
    @JsonIgnore
    private Tenant tenant;

    @PrePersist
    @PreUpdate
    public void onUpdate() {
        lastUpdate = LocalDateTime.now();
    }
}
