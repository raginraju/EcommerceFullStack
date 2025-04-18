package com.in6225.ecommerce.ecommerce_store.dto;

import com.in6225.ecommerce.ecommerce_store.entity.Order;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class OrderDto {

    private Long orderId;
    private Long userId;
    private float totalPrice;
    private Order.Status status;
    private String shippingAddr;
}

