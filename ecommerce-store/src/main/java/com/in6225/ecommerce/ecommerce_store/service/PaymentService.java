package com.in6225.ecommerce.ecommerce_store.service;

import com.in6225.ecommerce.ecommerce_store.dto.PaymentDto;

import java.util.List;

public interface PaymentService {

    PaymentDto createPayment(PaymentDto paymentDto);

    PaymentDto getPaymentById(Long id);

    List<PaymentDto> getAllPayments();

    List<PaymentDto> getPaymentsByOrderId(Long orderId);

    PaymentDto updatePaymentStatus(Long paymentId, String newStatus);

    void deletePayment(Long id);
}
