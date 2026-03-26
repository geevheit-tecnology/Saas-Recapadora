package com.retread.controller;

import com.retread.entity.Tire;
import com.retread.entity.TireHistory;
import com.retread.entity.TireStatus;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import com.retread.exception.ResourceNotFoundException;
import com.retread.repository.TireRepository;
import com.retread.service.TenantAccessService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/tires")
public class TireController {

    @Autowired
    private TireRepository tireRepository;

    @Autowired
    private TenantAccessService tenantAccessService;

    @GetMapping
    public List<TireListResponse> getAllTires() {
        return tireRepository.findAllByTenant_Id(tenantAccessService.getRequiredTenantId()).stream()
                .map(TireListResponse::from)
                .toList();
    }

    @PatchMapping("/{id}/status")
    @jakarta.transaction.Transactional
    public ResponseEntity<Tire> updateStatus(@PathVariable Long id, @Valid @RequestBody UpdateTireStatusRequest request) {
        String statusStr = request.status();
        String observation = request.observation();
        
        return tireRepository.findByIdAndTenant_Id(id, tenantAccessService.getRequiredTenantId()).map(tire -> {
            TireStatus newStatus = TireStatus.valueOf(statusStr.trim().toUpperCase());
            
            // Registro de Histórico
            TireHistory history = new TireHistory();
            history.setTire(tire);
            history.setStatusAtThatTime(newStatus);
            history.setTimestamp(LocalDateTime.now());
            
            // Fallback para o usuário caso o context esteja vazio
            String user = "Sistema";
            if (SecurityContextHolder.getContext().getAuthentication() != null) {
                user = SecurityContextHolder.getContext().getAuthentication().getName();
            }
            
            history.setUserName(user);
            history.setDescription("MUDANÇA DE STATUS: " + newStatus + ". OBS: " + (observation != null ? observation : "N/A"));
            
            tire.setStatus(newStatus);
            if (observation != null) tire.setObservation(observation);
            tire.getHistory().add(history);
            
            return ResponseEntity.ok(tireRepository.save(tire));
        }).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/by-status")
    public Map<String, List<Tire>> getTiresByStatus() {
        // Sênior: Garantindo que o mapa nunca retorne null para as chaves principais
        List<Tire> all = tireRepository.findAllByTenant_Id(tenantAccessService.getRequiredTenantId());
        Map<String, List<Tire>> map = all.stream().collect(Collectors.groupingBy(t -> t.getStatus().name()));
        
        // Garante que as colunas apareçam no frontend mesmo vazias
        String[] statuses = {"COLLECTED", "RECEIVED", "INSPECTION", "PRODUCTION", "READY"};
        for (String s : statuses) {
            map.putIfAbsent(s, new java.util.ArrayList<>());
        }
        return map;
    }

    public record UpdateTireStatusRequest(
            @NotBlank String status,
            String observation
    ) {
    }

    public record TireListResponse(
            Long id,
            String brand,
            String size,
            String serialNumber,
            String licensePlate,
            String status,
            ServiceOrderSummary serviceOrder
    ) {
        static TireListResponse from(Tire tire) {
            return new TireListResponse(
                    tire.getId(),
                    tire.getBrand(),
                    tire.getSize(),
                    tire.getSerialNumber(),
                    tire.getLicensePlate(),
                    tire.getStatus() != null ? tire.getStatus().name() : null,
                    tire.getServiceOrder() != null
                            ? new ServiceOrderSummary(
                                    tire.getServiceOrder().getId(),
                                    tire.getServiceOrder().getClient() != null
                                            ? new ClientSummary(
                                                    tire.getServiceOrder().getClient().getId(),
                                                    tire.getServiceOrder().getClient().getName()
                                            )
                                            : null
                            )
                            : null
            );
        }
    }

    public record ServiceOrderSummary(
            Long id,
            ClientSummary client
    ) {
    }

    public record ClientSummary(
            Long id,
            String name
    ) {
    }
}
