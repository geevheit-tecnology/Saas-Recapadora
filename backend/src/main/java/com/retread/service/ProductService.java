package com.retread.service;

import com.retread.entity.*;
import com.retread.exception.BusinessRuleException;
import com.retread.exception.ResourceNotFoundException;
import com.retread.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private InventoryMovementRepository movementRepository;

    @Transactional
    public void deductStock(Long tenantId, Long productId, Integer quantity) {
        validateQuantity(quantity);

        Product product = productRepository.findByIdAndTenant_Id(productId, tenantId)
                .orElseThrow(() -> new ResourceNotFoundException("Produto nao encontrado"));

        if (product.getType() == ProductType.MATERIAL) {
            int currentStock = product.getStockQuantity() == null ? 0 : product.getStockQuantity();
            if (currentStock < quantity) {
                throw new BusinessRuleException("Estoque insuficiente para o produto " + product.getName());
            }
            product.setStockQuantity(currentStock - quantity);
            
            InventoryMovement movement = new InventoryMovement();
            movement.setProduct(product);
            movement.setQuantity(-quantity);
            movement.setType("CONSUMPTION");
            movement.setTimestamp(LocalDateTime.now());
            movement.setTenant(product.getTenant());
            movementRepository.save(movement);
            
            productRepository.save(product);
        }
    }

    @Transactional
    public void registerPurchase(Long tenantId, Long productId, Long supplierId, Integer quantity, java.math.BigDecimal cost) {
        validateQuantity(quantity);
        if (cost == null || cost.signum() < 0) {
            throw new BusinessRuleException("O custo da compra deve ser maior ou igual a zero");
        }

        Product product = productRepository.findByIdAndTenant_Id(productId, tenantId)
                .orElseThrow(() -> new ResourceNotFoundException("Produto nao encontrado"));

        int currentStock = product.getStockQuantity() == null ? 0 : product.getStockQuantity();
        product.setStockQuantity(currentStock + quantity);
        
        InventoryMovement movement = new InventoryMovement();
        movement.setProduct(product);
        movement.setQuantity(quantity);
        movement.setUnitCost(cost);
        movement.setType("PURCHASE");
        movement.setTimestamp(LocalDateTime.now());
        movement.setTenant(product.getTenant());
        // Aqui buscaríamos o supplier se necessário
        
        movementRepository.save(movement);
        productRepository.save(product);
    }

    private void validateQuantity(Integer quantity) {
        if (quantity == null || quantity <= 0) {
            throw new BusinessRuleException("A quantidade deve ser maior que zero");
        }
    }
}
