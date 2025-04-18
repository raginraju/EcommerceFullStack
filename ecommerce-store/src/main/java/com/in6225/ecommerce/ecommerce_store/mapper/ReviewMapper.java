package com.in6225.ecommerce.ecommerce_store.mapper;

import com.in6225.ecommerce.ecommerce_store.dto.ReviewDto;
import com.in6225.ecommerce.ecommerce_store.entity.Review;

public class ReviewMapper {

    public static ReviewDto mapToReviewDto(Review review){
        return new ReviewDto(
                review.getReviewId(),
                review.getUserId(),
                review.getProductId(),
                review.getRating(),
                review.getComment()
        );
    }

    public static Review mapToReview(ReviewDto reviewDto){
        return new Review(
                reviewDto.getReviewId(),
                reviewDto.getUserId(),
                reviewDto.getProductId(),
                reviewDto.getRating(),
                reviewDto.getComment()
        );
    }
}

