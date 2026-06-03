package com.example.hackathon.service;

import com.example.hackathon.dto.CreateProductRequest;
import com.example.hackathon.dto.PageResponse;
import com.example.hackathon.dto.ProductDto;
import com.example.hackathon.dto.UpdateProductRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ProductService {

	public PageResponse<ProductDto> findAll(
			int page, int size, String search, Long categoryId, boolean alertOnly) {
		throw new UnsupportedOperationException("Not implemented yet");
	}

	public ProductDto findById(Long id) {
		throw new UnsupportedOperationException("Not implemented yet");
	}

	@Transactional
	public ProductDto create(CreateProductRequest request) {
		throw new UnsupportedOperationException("Not implemented yet");
	}

	@Transactional
	public ProductDto update(Long id, UpdateProductRequest request) {
		throw new UnsupportedOperationException("Not implemented yet");
	}

	@Transactional
	public void delete(Long id) {
		throw new UnsupportedOperationException("Not implemented yet");
	}
}
