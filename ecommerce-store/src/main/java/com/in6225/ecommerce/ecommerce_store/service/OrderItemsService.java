package com.in6225.ecommerce.ecommerce_store.service;

import com.in6225.ecommerce.ecommerce_store.dto.OrderItemsDto;
import java.util.List;

public interface OrderItemsService {

    OrderItemsDto createOrderItem(OrderItemsDto orderItemsDto);

    List<OrderItemsDto> getAllOrderItems();

    List<OrderItemsDto> getOrderItemsByOrderId(Long orderId);

    OrderItemsDto getOrderItemById(Long id);

    OrderItemsDto updateOrderItem(Long id, OrderItemsDto updatedDto);

    void deleteOrderItem(Long id);
}
