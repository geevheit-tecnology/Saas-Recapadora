package com.retread.repository;

import com.retread.entity.ServiceOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Repository
public interface ServiceOrderRepository extends JpaRepository<ServiceOrder, Long> {
    @EntityGraph(attributePaths = {"client", "tires"})
    List<ServiceOrder> findAllByTenant_Id(Long tenantId);

    @EntityGraph(attributePaths = {"client", "items", "items.product", "tires", "tires.history"})
    Optional<ServiceOrder> findByIdAndTenant_Id(Long id, Long tenantId);

    @EntityGraph(attributePaths = {"client", "tires"})
    Optional<ServiceOrder> findOneById(Long id);
    
    @Query(value = "SELECT COALESCE(TO_CHAR(order_date, 'MM/YYYY'), 'S/D') as month, " +
                   "SUM(COALESCE(total_amount, 0)) as total " +
                   "FROM service_order " +
                   "WHERE status = 'COMPLETED' AND tenant_id = :tenantId " +
                   "GROUP BY month " +
                   "ORDER BY month", nativeQuery = true)
    List<Map<String, Object>> getMonthlyRevenue(@Param("tenantId") Long tenantId);
}
