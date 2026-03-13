package com.retread.repository;

import com.retread.entity.InventoryMovement;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface InventoryMovementRepository extends JpaRepository<InventoryMovement, Long> {
    List<InventoryMovement> findAllByTenant_Id(Long tenantId);
}
