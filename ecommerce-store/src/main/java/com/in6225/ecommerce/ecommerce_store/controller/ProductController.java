package com.in6225.ecommerce.ecommerce_store.controller;


import com.in6225.ecommerce.ecommerce_store.dto.ProductDto;
import com.in6225.ecommerce.ecommerce_store.service.ProductService;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin("*")
@AllArgsConstructor
@RestController
@RequestMapping("/api/products")
public class ProductController {

    @Autowired
    private ProductService productService;

    @PostMapping
    public ResponseEntity<ProductDto> createProduct(@RequestBody ProductDto productDto){
        ProductDto saveProduct = productService.createProduct(productDto);
        return new ResponseEntity<>(saveProduct, HttpStatus.CREATED);
    }

    @GetMapping("{id}")
    public ResponseEntity<ProductDto> getEmployeeById(@PathVariable("id") Long productId){
        ProductDto productDto = productService.getProductById(productId);
        return ResponseEntity.ok(productDto);
    }

    @GetMapping
    public ResponseEntity<List<ProductDto>> getAllProducts(){
        List<ProductDto> products = productService.getAllProducts();
        return ResponseEntity.ok(products);
    }

    @PutMapping("{id}")
    public ResponseEntity<ProductDto> updateProduct(@PathVariable("id") Long productId,
                                                      @RequestBody ProductDto updatedProduct){
        ProductDto productDto = productService.updateProduct(productId, updatedProduct);
        return ResponseEntity.ok(productDto);
    }

    @DeleteMapping("{id}")
    public ResponseEntity<String> deleteProduct(@PathVariable("id") Long productId){
        productService.deleteProduct(productId);
        return ResponseEntity.ok("Product deleted successfully!.");
    }

    @GetMapping("search_name/{keyword}")
    public ResponseEntity<List<ProductDto>> searchProductsByName(@PathVariable("keyword") String keyword){
        List<ProductDto> products = productService.searchProductsByName(keyword);
        return ResponseEntity.ok(products);
    }

    @GetMapping("search_category/{category}")
    public ResponseEntity<List<ProductDto>> getProductsByCategory(@PathVariable("category") String category){
        List<ProductDto> products = productService.searchProductsByCategory(category);
        return ResponseEntity.ok(products);
    }
}

