package com.example.hackathon.service;

import com.example.hackathon.dto.CategoryDto;
import com.example.hackathon.dto.CreateCategoryRequest;
import com.example.hackathon.dto.UpdateCategoryRequest;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CategoryService {

	public List<CategoryDto> findAll() {
		throw new UnsupportedOperationException("Not implemented yet");
	}

	@Transactional
	public CategoryDto create(CreateCategoryRequest request) {
		throw new UnsupportedOperationException("Not implemented yet");
	}

	@Transactional
	public CategoryDto update(Long id, UpdateCategoryRequest request) {
		throw new UnsupportedOperationException("Not implemented yet");
	}

	@Transactional
	public void delete(Long id) {
		throw new UnsupportedOperationException("Not implemented yet");
	}
}
