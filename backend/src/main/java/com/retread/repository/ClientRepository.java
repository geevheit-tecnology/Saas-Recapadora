package com.retread.repository;

import com.retread.entity.Client;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ClientRepository extends JpaRepository<Client, Long> {
    List<Client> findAllByTenant_Id(Long tenantId);
    Optional<Client> findByIdAndTenant_Id(Long id, Long tenantId);
    long countByTenant_Id(Long tenantId);
}
