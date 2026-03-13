package com.retread.controller;

import com.retread.security.TenantUsernameResolver;
import com.retread.service.JwtService;
import com.retread.repository.UserRepository;
import com.retread.entity.User;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")

public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/login")
    public Map<String, String> login(@Valid @RequestBody LoginRequest request) {
        String username = request.username().trim();
        String password = request.password();
        String tenantSlug = request.tenantSlug().trim().toLowerCase();

        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            TenantUsernameResolver.compose(tenantSlug, username),
                            password
                    )
            );
        } catch (BadCredentialsException ex) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Credenciais invalidas");
        }

        User user = userRepository.findByUsernameAndTenant_Slug(username, tenantSlug)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Credenciais invalidas"));

        String token = jwtService.generateToken(username, user.getRole(), user.getTenant().getId(), user.getTenant().getSlug());
        
        Map<String, String> response = new HashMap<>();
        response.put("token", token);
        response.put("role", user.getRole());
        response.put("tenantSlug", user.getTenant().getSlug());
        response.put("tenantName", user.getTenant().getName());
        
        return response;
    }

    public record LoginRequest(
            @NotBlank String tenantSlug,
            @NotBlank String username,
            @NotBlank String password
    ) {
    }
}
