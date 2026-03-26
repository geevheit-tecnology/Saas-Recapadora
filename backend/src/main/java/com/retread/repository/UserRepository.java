package com.retread.repository;

import com.retread.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    @Query("""
            select u
            from User u
            join fetch u.tenant t
            where u.username = :username
              and t.slug = :tenantSlug
            """)
    Optional<User> findByUsernameAndTenant_Slug(@Param("username") String username, @Param("tenantSlug") String tenantSlug);
    List<User> findAllByTenant_Id(Long tenantId);
    Optional<User> findByIdAndTenant_Id(Long id, Long tenantId);
    boolean existsByUsernameAndTenant_Id(String username, Long tenantId);
}
