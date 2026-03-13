package com.retread.controller;

import com.retread.entity.Client;
import com.retread.exception.ResourceNotFoundException;
import com.retread.repository.ClientRepository;
import com.retread.service.TenantAccessService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/clients")

public class ClientController {

    @Autowired
    private ClientRepository clientRepository;

    @Autowired
    private TenantAccessService tenantAccessService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    public List<Client> getAllClients() {
        return clientRepository.findAllByTenant_Id(tenantAccessService.getRequiredTenantId());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    public ResponseEntity<Client> getClientById(@PathVariable Long id) {
        Client client = clientRepository.findByIdAndTenant_Id(id, tenantAccessService.getRequiredTenantId())
                .orElseThrow(() -> new ResourceNotFoundException("Cliente nao encontrado"));
        return ResponseEntity.ok(client);
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    public Client createClient(@Valid @RequestBody Client client) {
        client.setTenant(tenantAccessService.getRequiredTenant());
        return clientRepository.save(client);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    public ResponseEntity<Client> updateClient(@PathVariable Long id, @Valid @RequestBody Client clientDetails) {
        return clientRepository.findByIdAndTenant_Id(id, tenantAccessService.getRequiredTenantId())
                .map(client -> {
                    client.setName(clientDetails.getName());
                    client.setTaxId(clientDetails.getTaxId());
                    client.setPhone(clientDetails.getPhone());
                    client.setEmail(clientDetails.getEmail());
                    client.setAddress(clientDetails.getAddress());
                    return ResponseEntity.ok(clientRepository.save(client));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteClient(@PathVariable Long id) {
        return clientRepository.findByIdAndTenant_Id(id, tenantAccessService.getRequiredTenantId())
                .map(client -> {
                    clientRepository.delete(client);
                    return ResponseEntity.ok().<Void>build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
