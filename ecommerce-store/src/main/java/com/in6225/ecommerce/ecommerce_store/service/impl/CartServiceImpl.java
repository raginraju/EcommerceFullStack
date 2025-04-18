package com.in6225.ecommerce.ecommerce_store.service.impl;

import com.in6225.ecommerce.ecommerce_store.dto.CartDto;
import com.in6225.ecommerce.ecommerce_store.entity.Cart;
import com.in6225.ecommerce.ecommerce_store.mapper.CartMapper;
import com.in6225.ecommerce.ecommerce_store.repository.CartRepository;
import com.in6225.ecommerce.ecommerce_store.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CartServiceImpl implements CartService {

    private final CartRepository cartRepository;

    @Override
    public CartDto addToCart(CartDto cartDto) {
        Cart cart = CartMapper.mapToCart(cartDto);
        return CartMapper.mapToCartDto(cartRepository.save(cart));
    }

    @Override
    public CartDto updateCartItem(Long cartId, CartDto cartDto) {
        Cart existing = cartRepository.findById(cartId)
                .orElseThrow(() -> new RuntimeException("Cart item not found with id: " + cartId));
        existing.setQuantity(cartDto.getQuantity());
        return CartMapper.mapToCartDto(cartRepository.save(existing));
    }

    @Override
    public CartDto getCartItemById(Long cartId) {
        return cartRepository.findById(cartId)
                .map(CartMapper::mapToCartDto)
                .orElseThrow(() -> new RuntimeException("Cart item not found with id: " + cartId));
    }

    @Override
    public List<CartDto> getCartItemsByUserId(Long userId) {
        return cartRepository.findByUserId(userId)
                .stream()
                .map(CartMapper::mapToCartDto)
                .collect(Collectors.toList());
    }

    @Override
    public void removeCartItem(Long cartId) {
        cartRepository.deleteById(cartId);
    }


    @Override
    public void clearCartByUserId(Long userId) {
        cartRepository.deleteByUserId(userId);
    }
}
