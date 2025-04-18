package com.in6225.ecommerce.ecommerce_store.mapper;

import com.in6225.ecommerce.ecommerce_store.dto.OrderDto;
import com.in6225.ecommerce.ecommerce_store.entity.Order;

public class OrderMapper {

    public static OrderDto mapToOrderDto(Order order){
        return new OrderDto(
                order.getOrderId(),
                order.getUserId(),
                order.getTotalPrice(),
                order.getStatus(),
                order.getShippingAddr()
        );
    }

    public static Order mapToOrder(OrderDto orderDto){
        return new Order(
                orderDto.getOrderId(),
                orderDto.getUserId(),
                orderDto.getTotalPrice(),
                orderDto.getStatus(),
                orderDto.getShippingAddr()
        );
    }
}

