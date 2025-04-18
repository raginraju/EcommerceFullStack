package com.in6225.ecommerce.ecommerce_store.service.impl;

import com.in6225.ecommerce.ecommerce_store.dto.ReviewDto;
import com.in6225.ecommerce.ecommerce_store.entity.Review;
import com.in6225.ecommerce.ecommerce_store.mapper.ReviewMapper;
import com.in6225.ecommerce.ecommerce_store.repository.ReviewRepository;
import com.in6225.ecommerce.ecommerce_store.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReviewServiceImpl implements ReviewService {

    private final ReviewRepository reviewRepository;

    @Override
    public ReviewDto addReview(ReviewDto reviewDto) {
        Review review = ReviewMapper.mapToReview(reviewDto);
        return ReviewMapper.mapToReviewDto(reviewRepository.save(review));
    }

    @Override
    public ReviewDto updateReview(Long reviewId, ReviewDto reviewDto) {
        Review existing = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Review not found with id: " + reviewId));
        existing.setRating(reviewDto.getRating());
        existing.setComment(reviewDto.getComment());
        return ReviewMapper.mapToReviewDto(reviewRepository.save(existing));
    }

    @Override
    public ReviewDto getReviewById(Long reviewId) {
        return reviewRepository.findById(reviewId)
                .map(ReviewMapper::mapToReviewDto)
                .orElseThrow(() -> new RuntimeException("Review not found with id: " + reviewId));
    }

    @Override
    public List<ReviewDto> getReviewsByProductId(Long productId) {
        return reviewRepository.findByProductId(productId)
                .stream()
                .map(ReviewMapper::mapToReviewDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<ReviewDto> getReviewsByUserId(Long userId) {
        return reviewRepository.findByUserId(userId)
                .stream()
                .map(ReviewMapper::mapToReviewDto)
                .collect(Collectors.toList());
    }

    @Override
    public void deleteReview(Long reviewId) {
        reviewRepository.deleteById(reviewId);
    }
}
