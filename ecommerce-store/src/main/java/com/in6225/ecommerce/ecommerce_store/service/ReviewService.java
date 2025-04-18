package com.in6225.ecommerce.ecommerce_store.service;

import com.in6225.ecommerce.ecommerce_store.dto.ReviewDto;

import java.util.List;

public interface ReviewService {

    ReviewDto addReview(ReviewDto reviewDto);

    ReviewDto updateReview(Long reviewId, ReviewDto reviewDto);

    ReviewDto getReviewById(Long reviewId);

    List<ReviewDto> getReviewsByProductId(Long productId);

    List<ReviewDto> getReviewsByUserId(Long userId);

    void deleteReview(Long reviewId);
}
