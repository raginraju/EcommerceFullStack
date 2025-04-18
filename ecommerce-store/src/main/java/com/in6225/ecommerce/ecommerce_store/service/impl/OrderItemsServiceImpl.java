package com.in6225.ecommerce.ecommerce_store.service.impl;

import com.in6225.ecommerce.ecommerce_store.dto.OrderItemsDto;
import com.in6225.ecommerce.ecommerce_store.entity.OrderItems;
import com.in6225.ecommerce.ecommerce_store.mapper.OrderItemsMapper;
import com.in6225.ecommerce.ecommerce_store.repository.OrderItemsRepository;
import com.in6225.ecommerce.ecommerce_store.service.OrderItemsService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderItemsServiceImpl implements OrderItemsService {

    private final OrderItemsRepository orderItemsRepository;

    @Override
    public OrderItemsDto createOrderItem(OrderItemsDto orderItemsDto) {
        OrderItems item = OrderItemsMapper.mapToOrderItems(orderItemsDto);
        return OrderItemsMapper.mapToOrderItemsDto(orderItemsRepository.save(item));
    }

    @Override
    public List<OrderItemsDto> getAllOrderItems() {
        return orderItemsRepository.findAll()
                .stream()
                .map(OrderItemsMapper::mapToOrderItemsDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<OrderItemsDto> getOrderItemsByOrderId(Long orderId) {
        return orderItemsRepository.findByOrderId(orderId).stream()
                .map(OrderItemsMapper::mapToOrderItemsDto)
                .collect(Collectors.toList());
    }

    @Override
    public OrderItemsDto getOrderItemById(Long id) {
        OrderItems item = orderItemsRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order item not found with id: " + id));
        return OrderItemsMapper.mapToOrderItemsDto(item);
    }

    @Override
    public OrderItemsDto updateOrderItem(Long id, OrderItemsDto updatedDto) {
        OrderItems existing = orderItemsRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order item not found with id: " + id));

        existing.setOrderId(updatedDto.getOrderId());
        existing.setProductId(updatedDto.getProductId());
        existing.setQuantity(updatedDto.getQuantity());
        existing.setPriceAtPurchase(updatedDto.getPriceAtPurchase());

        return OrderItemsMapper.mapToOrderItemsDto(orderItemsRepository.save(existing));
    }

    @Override
    public void deleteOrderItem(Long id) {
        orderItemsRepository.deleteById(id);
    }
}
