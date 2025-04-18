package com.in6225.ecommerce.ecommerce_store.repository;

import com.in6225.ecommerce.ecommerce_store.entity.OrderItems;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderItemsRepository extends JpaRepository<OrderItems, Long> {
    List<OrderItems> findByOrderId(Long orderId);
}

