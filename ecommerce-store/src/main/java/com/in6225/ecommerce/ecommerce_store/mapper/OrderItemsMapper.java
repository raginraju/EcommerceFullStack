package com.in6225.ecommerce.ecommerce_store.mapper;

import com.in6225.ecommerce.ecommerce_store.dto.OrderItemsDto;
import com.in6225.ecommerce.ecommerce_store.entity.OrderItems;

public class OrderItemsMapper {

    public static OrderItemsDto mapToOrderItemsDto(OrderItems orderItems) {
        return new OrderItemsDto(
                orderItems.getOrderItemId(),
                orderItems.getOrderId(),
                orderItems.getProductId(),
                orderItems.getQuantity(),
                orderItems.getPriceAtPurchase()
        );
    }

    public static OrderItems mapToOrderItems(OrderItemsDto orderItems){
        return new OrderItems(
                orderItems.getOrderItemId(),
                orderItems.getOrderId(),
                orderItems.getProductId(),
                orderItems.getQuantity(),
                orderItems.getPriceAtPurchase()
        );
    }
}

