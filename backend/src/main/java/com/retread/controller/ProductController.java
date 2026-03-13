package com.retread.controller;

import com.retread.entity.Product;
import com.retread.exception.ResourceNotFoundException;
import com.retread.repository.ProductRepository;
import com.retread.service.TenantAccessService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/products")

public class ProductController {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private TenantAccessService tenantAccessService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    public List<Product> getAllProducts() {
        return productRepository.findAllByTenant_Id(tenantAccessService.getRequiredTenantId());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    public ResponseEntity<Product> getProductById(@PathVariable Long id) {
        Product product = productRepository.findByIdAndTenant_Id(id, tenantAccessService.getRequiredTenantId())
                .orElseThrow(() -> new ResourceNotFoundException("Produto nao encontrado"));
        return ResponseEntity.ok(product);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public Product createProduct(@Valid @RequestBody Product product) {
        product.setTenant(tenantAccessService.getRequiredTenant());
        return productRepository.save(product);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Product> updateProduct(@PathVariable Long id, @Valid @RequestBody Product productDetails) {
        return productRepository.findByIdAndTenant_Id(id, tenantAccessService.getRequiredTenantId())
                .map(product -> {
                    product.setName(productDetails.getName());
                    product.setDescription(productDetails.getDescription());
                    product.setPrice(productDetails.getPrice());
                    product.setType(productDetails.getType());
                    product.setStockQuantity(productDetails.getStockQuantity());
                    return ResponseEntity.ok(productRepository.save(product));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        return productRepository.findByIdAndTenant_Id(id, tenantAccessService.getRequiredTenantId())
                .map(product -> {
                    productRepository.delete(product);
                    return ResponseEntity.ok().<Void>build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
