package com.retread.config;

import com.retread.security.CustomUserPrincipal;
import com.retread.security.TenantUsernameResolver;
import com.retread.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class ApplicationConfig {

    @Autowired
    private UserRepository userRepository;

    @Bean
    public UserDetailsService userDetailsService() {
        return loginIdentifier -> {
            String tenantSlug = TenantUsernameResolver.extractTenantSlug(loginIdentifier);
            String username = TenantUsernameResolver.extractUsername(loginIdentifier);
            return userRepository.findByUsernameAndTenant_Slug(username, tenantSlug)
                .map(user -> {
                    java.util.List<org.springframework.security.core.GrantedAuthority> authorities = 
                        java.util.Collections.singletonList(new org.springframework.security.core.authority.SimpleGrantedAuthority(user.getRole()));
                    return new CustomUserPrincipal(
                            user.getId(),
                            user.getTenant().getId(),
                            user.getTenant().getSlug(),
                            user.getUsername(),
                            user.getPassword(),
                            authorities
                    );
                })
                .orElseThrow(() -> new UsernameNotFoundException("Usuario nao encontrado"));
        };
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider(userDetailsService());
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(12);
    }
}
