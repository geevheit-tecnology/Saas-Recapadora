package com.retread.repository;

import com.retread.entity.Supplier;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SupplierRepository extends JpaRepository<Supplier, Long> {
    List<Supplier> findAllByTenant_Id(Long tenantId);
    Optional<Supplier> findByIdAndTenant_Id(Long id, Long tenantId);
}
