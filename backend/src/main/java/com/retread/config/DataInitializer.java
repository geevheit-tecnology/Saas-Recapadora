package com.retread.config;

import com.retread.entity.Tenant;
import com.retread.entity.User;
import com.retread.repository.TenantRepository;
import com.retread.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@ConditionalOnProperty(name = "app.bootstrap-admin.enabled", havingValue = "true")
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TenantRepository tenantRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Value("${app.bootstrap-admin.tenant-name:Tenant Inicial}")
    private String bootstrapTenantName;

    @Value("${app.bootstrap-admin.tenant-slug:default}")
    private String bootstrapTenantSlug;

    @Value("${app.bootstrap-admin.username:admin}")
    private String bootstrapUsername;

    @Value("${app.bootstrap-admin.password:admin123}")
    private String bootstrapPassword;

    @Override
    public void run(String... args) {
        Tenant tenant = tenantRepository.findBySlug(bootstrapTenantSlug)
                .orElseGet(() -> {
                    Tenant newTenant = new Tenant();
                    newTenant.setName(bootstrapTenantName);
                    newTenant.setSlug(bootstrapTenantSlug);
                    newTenant.setActive(true);
                    return tenantRepository.save(newTenant);
                });

        userRepository.findByUsernameAndTenant_Slug(bootstrapUsername, bootstrapTenantSlug).ifPresentOrElse(
            user -> {
                user.setRole("ROLE_ADMIN");
                user.setTenant(tenant);
                userRepository.save(user);
                log.warn("Perfil do usuario bootstrap admin foi ajustado para ROLE_ADMIN no tenant {}", bootstrapTenantSlug);
            },
            () -> {
                User admin = new User();
                admin.setUsername(bootstrapUsername);
                admin.setPassword(passwordEncoder.encode(bootstrapPassword));
                admin.setRole("ROLE_ADMIN");
                admin.setTenant(tenant);
                userRepository.save(admin);
                log.warn("Usuario bootstrap admin criado no tenant {}. Desabilite app.bootstrap-admin.enabled apos o provisionamento inicial.", bootstrapTenantSlug);
            }
        );
    }
}
