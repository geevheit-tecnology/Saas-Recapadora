package com.retread.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;
import java.math.BigDecimal;

@Entity
@Data
@EqualsAndHashCode(exclude = "serviceOrder")
@ToString(exclude = "serviceOrder")
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "order_id")
    @JsonBackReference // Usando BackReference ao invés de Ignore puro para manter a relação correta
    private ServiceOrder serviceOrder;

    @ManyToOne
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    private Integer quantity;

    private BigDecimal price; // Price at the time of order
}
