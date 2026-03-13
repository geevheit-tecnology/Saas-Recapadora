package com.retread.repository;

import com.retread.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findAllByTenant_Id(Long tenantId);
    Optional<Product> findByIdAndTenant_Id(Long id, Long tenantId);
}
