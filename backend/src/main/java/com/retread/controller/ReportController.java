package com.retread.controller;

import com.retread.repository.ServiceOrderRepository;
import com.retread.service.TenantAccessService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reports")

public class ReportController {

    @Autowired
    private ServiceOrderRepository orderRepository;

    @Autowired
    private TenantAccessService tenantAccessService;

    @GetMapping("/revenue/monthly")
    public List<Map<String, Object>> getMonthlyRevenue() {
        return orderRepository.getMonthlyRevenue(tenantAccessService.getRequiredTenantId());
    }
}
