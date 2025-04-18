package com.in6225.ecommerce.ecommerce_store.controller;

import com.in6225.ecommerce.ecommerce_store.dto.CartDto;
import com.in6225.ecommerce.ecommerce_store.service.CartService;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin("*")
@AllArgsConstructor
@RestController
@RequestMapping("/api/cart")
public class CartController {

    @Autowired
    private CartService cartService;

    // Add item to cart
    @PostMapping
    public ResponseEntity<CartDto> addToCart(@RequestBody CartDto cartDto) {
        CartDto savedCart = cartService.addToCart(cartDto);
        return new ResponseEntity<>(savedCart, HttpStatus.CREATED);
    }

    // Get all items in a user's cart
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<CartDto>> getCartByUserId(@PathVariable("userId") Long userId) {
        List<CartDto> cartItems = cartService.getCartItemsByUserId(userId);
        return ResponseEntity.ok(cartItems);
    }

    // Update a cart item (e.g., change quantity)
    @PutMapping("{cartId}")
    public ResponseEntity<CartDto> updateCartItem(@PathVariable("cartId") Long cartId,
                                                  @RequestBody CartDto cartDto) {
        CartDto updatedCart = cartService.updateCartItem(cartId, cartDto);
        return ResponseEntity.ok(updatedCart);
    }

    // Delete an item from the cart
    @DeleteMapping("{cartId}")
    public ResponseEntity<String> deleteCartItem(@PathVariable("cartId") Long cartId) {
        cartService.removeCartItem(cartId);
        return ResponseEntity.ok("Item removed from cart.");
    }

    // Clear entire cart for a user
    @DeleteMapping("/user/{userId}")
    public ResponseEntity<String> clearUserCart(@PathVariable("userId") Long userId) {
        cartService.clearCartByUserId(userId);
        return ResponseEntity.ok("Cart cleared for user.");
    }
}
