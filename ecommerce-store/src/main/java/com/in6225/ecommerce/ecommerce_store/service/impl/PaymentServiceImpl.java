package com.in6225.ecommerce.ecommerce_store.service.impl;

import com.in6225.ecommerce.ecommerce_store.dto.PaymentDto;
import com.in6225.ecommerce.ecommerce_store.entity.Payment;
import com.in6225.ecommerce.ecommerce_store.mapper.PaymentMapper;
import com.in6225.ecommerce.ecommerce_store.repository.PaymentRepository;
import com.in6225.ecommerce.ecommerce_store.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PaymentServiceImpl implements PaymentService {

    private final PaymentRepository paymentRepository;

    @Override
    public PaymentDto createPayment(PaymentDto paymentDto) {
        Payment payment = PaymentMapper.mapToPayment(paymentDto);
        Payment saved = paymentRepository.save(payment);
        return PaymentMapper.mapToPaymentDto(saved);
    }

    @Override
    public PaymentDto getPaymentById(Long id) {
        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Payment not found with id: " + id));
        return PaymentMapper.mapToPaymentDto(payment);
    }

    @Override
    public List<PaymentDto> getAllPayments() {
        return paymentRepository.findAll()
                .stream()
                .map(PaymentMapper::mapToPaymentDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<PaymentDto> getPaymentsByOrderId(Long orderId) {
        return paymentRepository.findByOrderId(orderId)
                .stream()
                .map(PaymentMapper::mapToPaymentDto)
                .collect(Collectors.toList());
    }

    @Override
    public PaymentDto updatePaymentStatus(Long paymentId, String newStatus) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new RuntimeException("Payment not found with id: " + paymentId));
        payment.setStatus(Payment.Status.valueOf(newStatus));
        Payment updated = paymentRepository.save(payment);
        return PaymentMapper.mapToPaymentDto(updated);
    }

    @Override
    public void deletePayment(Long id) {
        paymentRepository.deleteById(id);
    }
}
