package com.retread.controller;

import com.retread.entity.User;
import com.retread.exception.BusinessRuleException;
import com.retread.exception.ResourceNotFoundException;
import com.retread.repository.UserRepository;
import com.retread.service.TenantAccessService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")

public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private TenantAccessService tenantAccessService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<User> getAll() {
        return userRepository.findAllByTenant_Id(tenantAccessService.getRequiredTenantId());
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public User create(@RequestBody User user) {
        Long tenantId = tenantAccessService.getRequiredTenantId();
        if (userRepository.existsByUsernameAndTenant_Id(user.getUsername(), tenantId)) {
            throw new BusinessRuleException("Ja existe um usuario com esse username no tenant atual");
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setRole(normalizeRole(user.getRole()));
        user.setTenant(tenantAccessService.getRequiredTenant());
        return userRepository.save(user);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void delete(@PathVariable Long id) {
        User user = userRepository.findByIdAndTenant_Id(id, tenantAccessService.getRequiredTenantId())
                .orElseThrow(() -> new ResourceNotFoundException("Usuario nao encontrado"));
        userRepository.delete(user);
    }

    private String normalizeRole(String role) {
        if (role == null || role.isBlank()) {
            return "ROLE_USER";
        }
        String normalized = role.trim().toUpperCase();
        if ("ROLE_ADMIN".equals(normalized) || "ADMIN".equals(normalized)) {
            return "ROLE_ADMIN";
        }
        return "ROLE_USER";
    }
}
