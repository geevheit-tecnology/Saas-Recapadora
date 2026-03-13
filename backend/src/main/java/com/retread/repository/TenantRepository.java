package com.retread.repository;

import com.retread.entity.Tenant;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TenantRepository extends JpaRepository<Tenant, Long> {
    Optional<Tenant> findBySlugAndActiveTrue(String slug);
    Optional<Tenant> findBySlug(String slug);
}
