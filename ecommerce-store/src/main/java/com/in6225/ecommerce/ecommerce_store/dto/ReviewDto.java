package com.in6225.ecommerce.ecommerce_store.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ReviewDto {

    private Long reviewId;
    private Long userId;
    private Long productId;
    private Integer rating;
    private String comment;
}

