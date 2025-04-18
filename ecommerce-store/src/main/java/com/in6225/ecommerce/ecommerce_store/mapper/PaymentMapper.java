package com.in6225.ecommerce.ecommerce_store.mapper;

import com.in6225.ecommerce.ecommerce_store.dto.PaymentDto;
import com.in6225.ecommerce.ecommerce_store.entity.Payment;

public class PaymentMapper {

    public static PaymentDto mapToPaymentDto(Payment payment){
        return new PaymentDto(
                payment.getPaymentId(),
                payment.getOrderId(),
                payment.getPaymentMethod(),
                payment.getAmount(),
                payment.getStatus(),
                payment.getPaidAt()
        );
    }

    public static Payment mapToPayment(PaymentDto paymentDto){
        return new Payment(
                paymentDto.getPaymentId(),
                paymentDto.getOrderId(),
                paymentDto.getPaymentMethod(),
                paymentDto.getAmount(),
                paymentDto.getStatus(),
                paymentDto.getPaidAt()
        );
    }
}

