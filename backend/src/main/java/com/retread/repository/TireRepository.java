package com.retread.repository;

import com.retread.entity.Tire;
import com.retread.entity.TireStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface TireRepository extends JpaRepository<Tire, Long> {
    List<Tire> findAllByTenant_Id(Long tenantId);
    Optional<Tire> findByIdAndTenant_Id(Long id, Long tenantId);
    List<Tire> findByStatusAndTenant_Id(TireStatus status, Long tenantId);
    List<Tire> findByServiceOrderIdAndTenant_Id(Long orderId, Long tenantId);
}
