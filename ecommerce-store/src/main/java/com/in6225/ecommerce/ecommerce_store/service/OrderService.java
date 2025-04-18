package com.in6225.ecommerce.ecommerce_store.service;

import com.in6225.ecommerce.ecommerce_store.dto.OrderDto;
import java.util.List;

public interface OrderService {

    OrderDto createOrder(OrderDto orderDto);

    OrderDto getOrderById(Long orderId);

    List<OrderDto> getAllOrders();

    List<OrderDto> getOrdersByUserId(Long userId);

    OrderDto updateOrderStatus(Long orderId, String newStatus);

    void deleteOrder(Long orderId);
}
