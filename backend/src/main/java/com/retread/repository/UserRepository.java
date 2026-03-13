package com.retread.repository;

import com.retread.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsernameAndTenant_Slug(String username, String tenantSlug);
    List<User> findAllByTenant_Id(Long tenantId);
    Optional<User> findByIdAndTenant_Id(Long id, Long tenantId);
    boolean existsByUsernameAndTenant_Id(String username, Long tenantId);
}
