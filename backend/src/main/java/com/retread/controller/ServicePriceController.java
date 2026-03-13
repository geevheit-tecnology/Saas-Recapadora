package com.retread.controller;

import com.retread.entity.ServicePrice;
import com.retread.exception.ResourceNotFoundException;
import jakarta.validation.Valid;
import com.retread.repository.ServicePriceRepository;
import com.retread.service.TenantAccessService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/service-prices")

public class ServicePriceController {
    @Autowired
    private ServicePriceRepository repository;

    @Autowired
    private TenantAccessService tenantAccessService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    public List<ServicePrice> getAll() {
        return repository.findAllByTenant_Id(tenantAccessService.getRequiredTenantId());
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ServicePrice create(@Valid @RequestBody ServicePrice servicePrice) {
        servicePrice.setTenant(tenantAccessService.getRequiredTenant());
        return repository.save(servicePrice);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void delete(@PathVariable Long id) {
        ServicePrice servicePrice = repository.findByIdAndTenant_Id(id, tenantAccessService.getRequiredTenantId())
                .orElseThrow(() -> new ResourceNotFoundException("Tabela de preco nao encontrada"));
        repository.delete(servicePrice);
    }
}
