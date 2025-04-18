package com.in6225.ecommerce.ecommerce_store.controller;

import com.in6225.ecommerce.ecommerce_store.dto.OrderItemsDto;
import com.in6225.ecommerce.ecommerce_store.service.OrderItemsService;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin("*")
@AllArgsConstructor
@RestController
@RequestMapping("/api/order_items")
public class OrderItemsController {

    @Autowired
    private OrderItemsService orderItemsService;

    @PostMapping
    public ResponseEntity<OrderItemsDto> createOrderItem(@RequestBody OrderItemsDto orderItemsDto) {
        OrderItemsDto savedItem = orderItemsService.createOrderItem(orderItemsDto);
        return new ResponseEntity<>(savedItem, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<OrderItemsDto>> getAllOrderItems() {
        List<OrderItemsDto> items = orderItemsService.getAllOrderItems();
        return ResponseEntity.ok(items);
    }

    @GetMapping("/order/{orderId}")
    public ResponseEntity<List<OrderItemsDto>> getOrderItemsByOrderId(@PathVariable("orderId") Long orderId) {
        List<OrderItemsDto> items = orderItemsService.getOrderItemsByOrderId(orderId);
        return ResponseEntity.ok(items);
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrderItemsDto> getOrderItemById(@PathVariable("id") Long id) {
        OrderItemsDto item = orderItemsService.getOrderItemById(id);
        return ResponseEntity.ok(item);
    }

    @PutMapping("/{id}")
    public ResponseEntity<OrderItemsDto> updateOrderItem(@PathVariable("id") Long id,
                                                         @RequestBody OrderItemsDto updatedDto) {
        OrderItemsDto updatedItem = orderItemsService.updateOrderItem(id, updatedDto);
        return ResponseEntity.ok(updatedItem);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteOrderItem(@PathVariable("id") Long id) {
        orderItemsService.deleteOrderItem(id);
        return ResponseEntity.ok("Order item deleted successfully.");
    }
}
