package com.retread.repository;

import com.retread.entity.Tire;
import com.retread.entity.TireStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.EntityGraph;
import java.util.List;
import java.util.Optional;

public interface TireRepository extends JpaRepository<Tire, Long> {
    @EntityGraph(attributePaths = {"history", "serviceOrder", "serviceOrder.client"})
    List<Tire> findAllByTenant_Id(Long tenantId);

    @EntityGraph(attributePaths = {"history", "serviceOrder", "serviceOrder.client"})
    Optional<Tire> findByIdAndTenant_Id(Long id, Long tenantId);
    List<Tire> findByStatusAndTenant_Id(TireStatus status, Long tenantId);
    List<Tire> findByServiceOrderIdAndTenant_Id(Long orderId, Long tenantId);
    boolean existsBySerialNumberIgnoreCaseAndTenant_Id(String serialNumber, Long tenantId);
}
