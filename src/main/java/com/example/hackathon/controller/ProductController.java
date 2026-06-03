package com.example.hackathon.controller;

import com.example.hackathon.dto.CreateProductRequest;
import com.example.hackathon.dto.PageResponse;
import com.example.hackathon.dto.ProductDto;
import com.example.hackathon.dto.UpdateProductRequest;
import com.example.hackathon.service.ProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

	private final ProductService productService;

	@GetMapping
	public ResponseEntity<PageResponse<ProductDto>> findAll(
			@RequestParam(defaultValue = "0") int page,
			@RequestParam(defaultValue = "20") int size,
			@RequestParam(required = false) String search,
			@RequestParam(required = false) Long categoryId,
			@RequestParam(defaultValue = "false") boolean alertOnly) {
		return ResponseEntity.ok(productService.findAll(page, size, search, categoryId, alertOnly));
	}

	@GetMapping("/{id}")
	public ResponseEntity<ProductDto> findById(@PathVariable Long id) {
		return ResponseEntity.ok(productService.findById(id));
	}

	@PostMapping
	public ResponseEntity<ProductDto> create(@Valid @RequestBody CreateProductRequest request) {
		return ResponseEntity.status(HttpStatus.CREATED).body(productService.create(request));
	}

	@PutMapping("/{id}")
	public ResponseEntity<ProductDto> update(
			@PathVariable Long id, @Valid @RequestBody UpdateProductRequest request) {
		return ResponseEntity.ok(productService.update(id, request));
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<Void> delete(@PathVariable Long id) {
		productService.delete(id);
		return ResponseEntity.noContent().build();
	}
}
