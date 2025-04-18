package com.in6225.ecommerce.ecommerce_store.mapper;

import com.in6225.ecommerce.ecommerce_store.dto.ProductDto;
import com.in6225.ecommerce.ecommerce_store.entity.Product;

public class ProductMapper {

    public static ProductDto mapToProductDto(Product product){
        return new ProductDto(
                product.getProductId(),
                product.getName(),
                product.getDescription(),
                product.getPrice(),
                product.getStockQuantity(),
                product.getCategory(),
                product.getImageUrl()
        );
    }

    public static Product mapToProduct(ProductDto productDto){
        return new Product(
                productDto.getProductId(),
                productDto.getName(),
                productDto.getDescription(),
                productDto.getPrice(),
                productDto.getStockQuantity(),
                productDto.getCategory(),
                productDto.getImageUrl()
        );
    }
}

