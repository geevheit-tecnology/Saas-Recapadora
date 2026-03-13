package com.retread.service;

import com.retread.entity.Tenant;
import com.retread.exception.BusinessRuleException;
import com.retread.exception.ResourceNotFoundException;
import com.retread.repository.TenantRepository;
import com.retread.security.TenantContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class TenantAccessService {

    @Autowired
    private TenantRepository tenantRepository;

    public Long getRequiredTenantId() {
        Long tenantId = TenantContext.getTenantId();
        if (tenantId == null) {
            throw new BusinessRuleException("Tenant nao resolvido para a requisicao atual");
        }
        return tenantId;
    }

    public String getRequiredTenantSlug() {
        String tenantSlug = TenantContext.getTenantSlug();
        if (tenantSlug == null || tenantSlug.isBlank()) {
            throw new BusinessRuleException("Tenant nao resolvido para a requisicao atual");
        }
        return tenantSlug;
    }

    public Tenant getRequiredTenant() {
        Long tenantId = getRequiredTenantId();
        return tenantRepository.findById(tenantId)
                .orElseThrow(() -> new ResourceNotFoundException("Tenant nao encontrado"));
    }
}
