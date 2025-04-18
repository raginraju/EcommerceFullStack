package com.in6225.ecommerce.ecommerce_store.dto;

import com.in6225.ecommerce.ecommerce_store.entity.Payment;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PaymentDto {

    private Long paymentId;
    private Long orderId;
    private Payment.PaymentMethod paymentMethod;
    private float amount;
    private Payment.Status status;
    private LocalDateTime paidAt;
}

