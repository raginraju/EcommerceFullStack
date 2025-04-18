package com.in6225.ecommerce.ecommerce_store.repository;

import com.in6225.ecommerce.ecommerce_store.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PaymentRepository extends JpaRepository<Payment, Long> {
    List<Payment> findByOrderId(Long orderId);
}

