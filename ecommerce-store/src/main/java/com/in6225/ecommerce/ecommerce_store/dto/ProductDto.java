package com.in6225.ecommerce.ecommerce_store.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ProductDto {

    private Long productId;
    private String name;
    private String description;
    private float price;
    private Long stockQuantity;
    private String category;
    private String imageUrl;
}

