package com.in6225.ecommerce.ecommerce_store.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class OrderItemsDto {

    private Long orderItemId;
    private Long orderId;
    private Long productId;
    private Integer quantity;
    private String priceAtPurchase;
}

