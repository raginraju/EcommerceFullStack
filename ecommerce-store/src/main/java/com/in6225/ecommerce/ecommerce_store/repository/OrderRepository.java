package com.in6225.ecommerce.ecommerce_store.repository;

import com.in6225.ecommerce.ecommerce_store.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUserId(Long userId);
}

