package com.retread.controller;

import com.retread.entity.Supplier;
import jakarta.validation.Valid;
import com.retread.repository.SupplierRepository;
import com.retread.service.TenantAccessService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/suppliers")

public class SupplierController {
    @Autowired
    private SupplierRepository supplierRepository;

    @Autowired
    private TenantAccessService tenantAccessService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    public List<Supplier> getAll() {
        return supplierRepository.findAllByTenant_Id(tenantAccessService.getRequiredTenantId());
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public Supplier create(@Valid @RequestBody Supplier supplier) {
        supplier.setTenant(tenantAccessService.getRequiredTenant());
        return supplierRepository.save(supplier);
    }
}
