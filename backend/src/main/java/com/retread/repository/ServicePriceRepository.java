package com.retread.repository;

import com.retread.entity.ServicePrice;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ServicePriceRepository extends JpaRepository<ServicePrice, Long> {
    List<ServicePrice> findAllByTenant_Id(Long tenantId);
    Optional<ServicePrice> findByIdAndTenant_Id(Long id, Long tenantId);
    Optional<ServicePrice> findByTireSizeAndServiceNameAndTenant_Id(String tireSize, String serviceName, Long tenantId);
}
