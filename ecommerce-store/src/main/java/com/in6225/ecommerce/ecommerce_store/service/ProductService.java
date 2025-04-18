package com.in6225.ecommerce.ecommerce_store.service;

import com.in6225.ecommerce.ecommerce_store.dto.ProductDto;

import java.util.List;

public interface ProductService {

    ProductDto createProduct(ProductDto productDto);

    ProductDto getProductById(Long productId);

    List<ProductDto> getAllProducts();

    ProductDto updateProduct(Long productId, ProductDto updatedProduct);

    void deleteProduct(Long productId);

    List<ProductDto>  searchProductsByName(String keyword);

    List<ProductDto>  searchProductsByCategory(String category);

}

