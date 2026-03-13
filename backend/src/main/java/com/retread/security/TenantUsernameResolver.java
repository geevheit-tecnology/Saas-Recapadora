package com.retread.security;

public final class TenantUsernameResolver {

    private static final String SEPARATOR = "|";

    private TenantUsernameResolver() {
    }

    public static String compose(String tenantSlug, String username) {
        return tenantSlug + SEPARATOR + username;
    }

    public static String extractTenantSlug(String value) {
        int separatorIndex = value.indexOf(SEPARATOR);
        if (separatorIndex <= 0) {
            throw new IllegalArgumentException("Tenant slug ausente no identificador de autenticacao");
        }
        return value.substring(0, separatorIndex);
    }

    public static String extractUsername(String value) {
        int separatorIndex = value.indexOf(SEPARATOR);
        if (separatorIndex <= 0 || separatorIndex == value.length() - 1) {
            throw new IllegalArgumentException("Usuario ausente no identificador de autenticacao");
        }
        return value.substring(separatorIndex + 1);
    }
}
