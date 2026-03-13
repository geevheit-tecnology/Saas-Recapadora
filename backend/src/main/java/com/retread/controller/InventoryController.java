package com.retread.controller;

import jakarta.validation.Valid;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import com.retread.service.ProductService;
import com.retread.service.TenantAccessService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;

@RestController
@RequestMapping("/api/inventory")

public class InventoryController {
    @Autowired
    private ProductService productService;

    @Autowired
    private TenantAccessService tenantAccessService;

    @PostMapping("/purchase")
    public void registerPurchase(@Valid @RequestBody PurchaseRequest request) {
        productService.registerPurchase(
                tenantAccessService.getRequiredTenantId(),
                request.productId(),
                request.supplierId(),
                request.quantity(),
                request.cost()
        );
    }

    public record PurchaseRequest(
            @NotNull Long productId,
            Long supplierId,
            @NotNull @Positive Integer quantity,
            @NotNull @DecimalMin(value = "0.0", inclusive = true) BigDecimal cost
    ) {
    }
}
