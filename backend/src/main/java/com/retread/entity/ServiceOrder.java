package com.retread.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "service_order")
@Data
@EqualsAndHashCode(exclude = {"items", "tires"}) // Evita loop no Lombok
@ToString(exclude = {"items", "tires"}) // Evita loop no Lombok
public class ServiceOrder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "client_id", nullable = false)
    private Client client;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tenant_id", nullable = false)
    @JsonIgnore
    private Tenant tenant;

    private LocalDateTime orderDate;

    @Enumerated(EnumType.STRING)
    private OrderStatus status;

    private BigDecimal totalAmount;

    @OneToMany(mappedBy = "serviceOrder", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference // Lado "Pai" da relação
    private List<OrderItem> items = new ArrayList<>();

    @OneToMany(mappedBy = "serviceOrder", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference // Lado "Pai" da relação
    private List<Tire> tires = new ArrayList<>();

    // Campos Sênior para Integração de Faturamento
    private String fiscalNoteId;      // ID da Nota Fiscal no Gateway
    private String fiscalNoteStatus;  // PENDING, ISSUED, ERROR
    private String billingId;         // ID do Boleto/Pix no Banco
    private String billingUrl;        // Link para o cliente pagar
    private String billingStatus;     // WAITING, PAID, OVERDUE

    @PrePersist
    protected void onCreate() {
        orderDate = LocalDateTime.now();
        if (status == null) status = OrderStatus.OPEN;
        calculateTotal();
    }

    public void calculateTotal() {
        this.totalAmount = items.stream()
                .map(item -> item.getPrice().multiply(new BigDecimal(item.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }
}
