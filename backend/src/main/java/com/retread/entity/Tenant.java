package com.retread.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Entity
@Table(name = "tenants", uniqueConstraints = {
        @UniqueConstraint(columnNames = "slug")
})
@Data
public class Tenant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Tenant name is required")
    @Column(nullable = false)
    private String name;

    @NotBlank(message = "Tenant slug is required")
    @Column(nullable = false)
    private String slug;

    @Column(nullable = false)
    private boolean active = true;
}
