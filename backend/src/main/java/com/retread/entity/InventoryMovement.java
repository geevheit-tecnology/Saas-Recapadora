package com.retread.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Data
public class InventoryMovement {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @ManyToOne
    @JoinColumn(name = "supplier_id")
    private Supplier supplier;

    private Integer quantity; // Positivo para Entrada, Negativo para Saída
    private java.math.BigDecimal unitCost;
    private LocalDateTime timestamp;
    private String type; // PURCHASE (Compra), CONSUMPTION (Uso na Produção), ADJUSTMENT (Ajuste)

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tenant_id", nullable = false)
    @JsonIgnore
    private Tenant tenant;
}
