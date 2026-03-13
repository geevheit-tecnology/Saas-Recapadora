package com.retread.controller;

import com.retread.entity.OrderItem;
import com.retread.entity.Product;
import com.retread.entity.ServiceOrder;
import com.retread.entity.Tire;
import com.retread.entity.TireStatus;
import com.retread.exception.BusinessRuleException;
import com.retread.exception.ResourceNotFoundException;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import com.retread.repository.ClientRepository;
import com.retread.repository.ProductRepository;
import com.retread.repository.ServiceOrderRepository;
import com.retread.service.ProductService;
import com.retread.service.TenantAccessService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private ServiceOrderRepository orderRepository;

    @Autowired
    private ClientRepository clientRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ProductService productService;

    @Autowired
    private TenantAccessService tenantAccessService;

    @GetMapping
    public List<ServiceOrder> getAllOrders() {
        return orderRepository.findAllByTenant_Id(tenantAccessService.getRequiredTenantId());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ServiceOrder> getOrderById(@PathVariable Long id) {
        ServiceOrder order = orderRepository.findByIdAndTenant_Id(id, tenantAccessService.getRequiredTenantId())
                .orElseThrow(() -> new ResourceNotFoundException("Ordem nao encontrada"));
        return ResponseEntity.ok(order);
    }

    @GetMapping("/track/{id}")
    public ResponseEntity<ServiceOrder> trackOrder(@PathVariable Long id) {
        throw new ResourceNotFoundException("Tracking publico por ID foi descontinuado. Use um token publico de rastreio.");
    }

    @PostMapping
    @jakarta.transaction.Transactional
    public ServiceOrder createOrder(@Valid @RequestBody ServiceOrder order) {
        Long tenantId = tenantAccessService.getRequiredTenantId();
        if (order.getClient() == null || order.getClient().getId() == null) {
            throw new BusinessRuleException("A ordem precisa estar vinculada a um cliente existente");
        }
        order.setTenant(tenantAccessService.getRequiredTenant());
        order.setClient(clientRepository.findByIdAndTenant_Id(order.getClient().getId(), tenantId)
                .orElseThrow(() -> new ResourceNotFoundException("Cliente nao encontrado")));
        
        if (order.getItems() != null) {
            for (OrderItem item : order.getItems()) {
                if (item.getProduct() == null || item.getProduct().getId() == null) {
                    throw new BusinessRuleException("Todo item da ordem precisa referenciar um produto existente");
                }
                if (item.getQuantity() == null || item.getQuantity() <= 0) {
                    throw new BusinessRuleException("A quantidade do item deve ser maior que zero");
                }
                if (item.getPrice() == null) {
                    throw new BusinessRuleException("O preco do item deve ser informado");
                }
                Product product = productRepository.findByIdAndTenant_Id(item.getProduct().getId(), tenantId)
                        .orElseThrow(() -> new ResourceNotFoundException("Produto nao encontrado"));
                item.setServiceOrder(order);
                item.setProduct(product);
                productService.deductStock(tenantId, product.getId(), item.getQuantity());
            }
        }

        if (order.getTires() != null) {
            for (Tire tire : order.getTires()) {
                tire.setServiceOrder(order);
                tire.setTenant(order.getTenant());
                // Força o status inicial caso venha vazio
                if (tire.getStatus() == null) {
                    tire.setStatus(TireStatus.COLLECTED);
                }
            }
        }

        order.calculateTotal();
        return orderRepository.save(order);
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ServiceOrder> updateStatus(@PathVariable Long id, @Valid @RequestBody UpdateOrderStatusRequest request) {
        return orderRepository.findByIdAndTenant_Id(id, tenantAccessService.getRequiredTenantId())
                .map(order -> {
                    order.setStatus(com.retread.entity.OrderStatus.valueOf(request.status().trim().toUpperCase()));
                    return ResponseEntity.ok(orderRepository.save(order));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    public record UpdateOrderStatusRequest(
            @NotBlank String status
    ) {
    }
}
