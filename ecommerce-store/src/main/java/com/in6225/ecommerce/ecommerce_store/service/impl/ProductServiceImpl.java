package com.in6225.ecommerce.ecommerce_store.service.impl;


import com.in6225.ecommerce.ecommerce_store.dto.ProductDto;
import com.in6225.ecommerce.ecommerce_store.entity.Product;
import com.in6225.ecommerce.ecommerce_store.exception.ResourceNotFoundException;
import com.in6225.ecommerce.ecommerce_store.mapper.ProductMapper;
import com.in6225.ecommerce.ecommerce_store.repository.ProductRepository;
import com.in6225.ecommerce.ecommerce_store.service.ProductService;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class ProductServiceImpl implements ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Override
    public ProductDto createProduct(ProductDto productDto) {
        Product product = ProductMapper.mapToProduct(productDto);
        Product savedProduct = productRepository.save(product);
        return ProductMapper.mapToProductDto(savedProduct);
    }

    @Override
    public ProductDto getProductById(Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Product does not exists with given id : " + productId));

        return ProductMapper.mapToProductDto(product);
    }

    @Override
    public List<ProductDto> getAllProducts() {
        List<Product> products = productRepository.findAll();
        return products.stream().map(ProductMapper::mapToProductDto)
                .collect(Collectors.toList());
    }

    @Override
    public ProductDto updateProduct(Long productId, ProductDto updatedProduct) {
        Product product = productRepository.findById(productId).orElseThrow(
                () -> new ResourceNotFoundException("User does not exists with given id: " + productId)
        );
        product.setName(updatedProduct.getName());
        product.setDescription(updatedProduct.getDescription());
        product.setPrice(updatedProduct.getPrice());
        product.setStockQuantity(updatedProduct.getStockQuantity());
        product.setCategory(updatedProduct.getCategory());
        product.setImageUrl(updatedProduct.getImageUrl());


        Product updatedProductObj = productRepository.save(product);

        return ProductMapper.mapToProductDto(updatedProductObj);
    }

    @Override
    public void deleteProduct(Long productId) {

        Product product = productRepository.findById(productId).orElseThrow(
                () -> new ResourceNotFoundException("User does not exists with given id: " + productId)
        );

        productRepository.deleteById(productId);

    }

    @Override
    public List<ProductDto> searchProductsByName(String keyword) {
        List<Product> products = productRepository.findByNameContainingIgnoreCase(keyword);
        return products.stream().map(ProductMapper::mapToProductDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<ProductDto> searchProductsByCategory(String category) {
        List<Product> products = productRepository.findByCategory(category);
        return products.stream().map(ProductMapper::mapToProductDto)
                .collect(Collectors.toList());
    }



}

