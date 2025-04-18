package com.in6225.ecommerce.ecommerce_store.repository;

import com.in6225.ecommerce.ecommerce_store.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {

    List<Product> findByNameContainingIgnoreCase(String keyword);
    List<Product> findByCategory(String category);

}

