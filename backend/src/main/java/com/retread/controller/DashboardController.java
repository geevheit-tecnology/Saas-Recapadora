package com.retread.controller;

import com.retread.repository.ClientRepository;
import com.retread.repository.ProductRepository;
import com.retread.repository.ServiceOrderRepository;
import com.retread.repository.InventoryMovementRepository;
import com.retread.entity.ServiceOrder;
import com.retread.entity.InventoryMovement;
import com.retread.entity.OrderStatus;
import com.retread.service.TenantAccessService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/dashboard")

public class DashboardController {

    @Autowired
    private ClientRepository clientRepository;

    @Autowired
    private ServiceOrderRepository orderRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private InventoryMovementRepository movementRepository;

    @Autowired
    private TenantAccessService tenantAccessService;

    @GetMapping("/stats")
    public Map<String, Object> getStats() {
        Long tenantId = tenantAccessService.getRequiredTenantId();
        List<ServiceOrder> allOrders = orderRepository.findAllByTenant_Id(tenantId);
        
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalClients", clientRepository.countByTenant_Id(tenantId));
        stats.put("totalOrders", allOrders.size());
        
        BigDecimal totalRevenue = allOrders.stream()
                .filter(o -> o.getStatus() == OrderStatus.COMPLETED)
                .map(ServiceOrder::getTotalAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        stats.put("totalRevenue", totalRevenue);

        // Cálculo de Custo Total (Insumos CONSUMIDOS)
        BigDecimal totalCost = movementRepository.findAllByTenant_Id(tenantId).stream()
                .filter(m -> "CONSUMPTION".equals(m.getType()))
                .map(m -> {
                    // Pega o custo unitário da última compra ou 0 se não houver
                    BigDecimal cost = m.getUnitCost() != null ? m.getUnitCost() : BigDecimal.ZERO;
                    return cost.multiply(new BigDecimal(Math.abs(m.getQuantity())));
                })
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        stats.put("totalCost", totalCost);
        stats.put("netProfit", totalRevenue.subtract(totalCost));

        Map<String, Long> ordersByStatus = allOrders.stream()
                .collect(Collectors.groupingBy(o -> o.getStatus().name(), Collectors.counting()));
        stats.put("ordersByStatus", ordersByStatus);

        List<ServiceOrder> recentOrders = allOrders.stream()
                .sorted((o1, o2) -> o2.getOrderDate().compareTo(o1.getOrderDate()))
                .limit(5)
                .collect(Collectors.toList());
        stats.put("recentOrders", recentOrders);

        return stats;
    }
}
