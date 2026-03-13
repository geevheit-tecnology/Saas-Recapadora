package com.retread.security;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;

public class CustomUserPrincipal implements UserDetails {

    private final Long userId;
    private final Long tenantId;
    private final String tenantSlug;
    private final String username;
    private final String password;
    private final Collection<? extends GrantedAuthority> authorities;

    public CustomUserPrincipal(
            Long userId,
            Long tenantId,
            String tenantSlug,
            String username,
            String password,
            Collection<? extends GrantedAuthority> authorities
    ) {
        this.userId = userId;
        this.tenantId = tenantId;
        this.tenantSlug = tenantSlug;
        this.username = username;
        this.password = password;
        this.authorities = authorities;
    }

    public Long getUserId() {
        return userId;
    }

    public Long getTenantId() {
        return tenantId;
    }

    public String getTenantSlug() {
        return tenantSlug;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return username;
    }
}
