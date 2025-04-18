package com.in6225.ecommerce.ecommerce_store.mapper;

import com.in6225.ecommerce.ecommerce_store.dto.CartDto;
import com.in6225.ecommerce.ecommerce_store.entity.Cart;

public class CartMapper {

    public static CartDto mapToCartDto(Cart cart){
        return new CartDto(
                cart.getCartId(),
                cart.getUserId(),
                cart.getProductId(),
                cart.getQuantity()
        );
    }

    public static Cart mapToCart(CartDto cartDto){
        return new Cart(
                cartDto.getCartId(),
                cartDto.getUserId(),
                cartDto.getProductId(),
                cartDto.getQuantity()
        );
    }
}

