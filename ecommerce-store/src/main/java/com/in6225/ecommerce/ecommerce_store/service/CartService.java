package com.in6225.ecommerce.ecommerce_store.service;

import com.in6225.ecommerce.ecommerce_store.dto.CartDto;

import java.util.List;

public interface CartService {

    CartDto addToCart(CartDto cartDto);

    CartDto updateCartItem(Long cartId, CartDto cartDto);

    CartDto getCartItemById(Long cartId);

    List<CartDto> getCartItemsByUserId(Long userId);

    void removeCartItem(Long cartId);

    void clearCartByUserId(Long userId);
}
