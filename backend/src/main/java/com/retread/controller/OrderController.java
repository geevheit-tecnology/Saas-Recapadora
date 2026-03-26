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
import com.retread.repository.TireRepository;
import com.retread.service.ProductService;
import com.retread.service.TenantAccessService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

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
    private TireRepository tireRepository;

    @Autowired
    private TenantAccessService tenantAccessService;

    @GetMapping
    public List<OrderSummaryResponse> getAllOrders() {
        return orderRepository.findAllByTenant_Id(tenantAccessService.getRequiredTenantId()).stream()
                .map(OrderSummaryResponse::from)
                .toList();
    }

    @GetMapping("/{id}")
    public ResponseEntity<ServiceOrder> getOrderById(@PathVariable Long id) {
        ServiceOrder order = orderRepository.findByIdAndTenant_Id(id, tenantAccessService.getRequiredTenantId())
                .orElseThrow(() -> new ResourceNotFoundException("Ordem nao encontrada"));
        return ResponseEntity.ok(order);
    }

    @GetMapping("/track/{id}")
    public ResponseEntity<PublicTrackingResponse> trackOrder(@PathVariable Long id) {
        ServiceOrder order = orderRepository.findOneById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ordem nao encontrada"));
        return ResponseEntity.ok(PublicTrackingResponse.from(order));
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
            Set<String> serialNumbersInRequest = new HashSet<>();
            for (Tire tire : order.getTires()) {
                if (tire.getSerialNumber() == null || tire.getSerialNumber().isBlank()) {
                    throw new BusinessRuleException("Todo pneu da coleta precisa informar numero de serie");
                }
                String normalizedSerial = tire.getSerialNumber().trim().toUpperCase();
                if (!serialNumbersInRequest.add(normalizedSerial)) {
                    throw new BusinessRuleException("A coleta contem pneus duplicados com o numero de serie " + normalizedSerial);
                }
                if (tireRepository.existsBySerialNumberIgnoreCaseAndTenant_Id(normalizedSerial, tenantId)) {
                    throw new BusinessRuleException("Ja existe um pneu cadastrado com o numero de serie " + normalizedSerial);
                }
                tire.setServiceOrder(order);
                tire.setTenant(order.getTenant());
                tire.setSerialNumber(normalizedSerial);
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

    public record OrderSummaryResponse(
            Long id,
            ClientSummary client,
            LocalDateTime orderDate,
            String status,
            BigDecimal totalAmount,
            List<TireSummary> tires,
            String fiscalNoteStatus,
            String billingStatus,
            String billingUrl
    ) {
        static OrderSummaryResponse from(ServiceOrder order) {
            return new OrderSummaryResponse(
                    order.getId(),
                    new ClientSummary(order.getClient().getId(), order.getClient().getName(), order.getClient().getPhone()),
                    order.getOrderDate(),
                    order.getStatus() != null ? order.getStatus().name() : null,
                    order.getTotalAmount(),
                    order.getTires().stream()
                            .map(tire -> new TireSummary(tire.getId(), tire.getStatus() != null ? tire.getStatus().name() : null))
                            .collect(Collectors.toList()),
                    order.getFiscalNoteStatus(),
                    order.getBillingStatus(),
                    order.getBillingUrl()
            );
        }
    }

    public record ClientSummary(
            Long id,
            String name,
            String phone
    ) {
    }

    public record TireSummary(
            Long id,
            String status
    ) {
    }

    public record PublicTrackingResponse(
            Long id,
            ClientSummary client,
            String status,
            List<PublicTrackingTireResponse> tires
    ) {
        static PublicTrackingResponse from(ServiceOrder order) {
            return new PublicTrackingResponse(
                    order.getId(),
                    new ClientSummary(
                            order.getClient().getId(),
                            order.getClient().getName(),
                            order.getClient().getPhone()
                    ),
                    order.getStatus() != null ? order.getStatus().name() : null,
                    order.getTires().stream()
                            .map(tire -> new PublicTrackingTireResponse(
                                    tire.getId(),
                                    tire.getBrand(),
                                    tire.getSize(),
                                    tire.getSerialNumber(),
                                    tire.getStatus() != null ? tire.getStatus().name() : null
                            ))
                            .collect(Collectors.toList())
            );
        }
    }

    public record PublicTrackingTireResponse(
            Long id,
            String brand,
            String size,
            String serialNumber,
            String status
    ) {
    }
}
