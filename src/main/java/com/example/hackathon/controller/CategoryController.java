package com.example.hackathon.controller;

import com.example.hackathon.dto.CategoryDto;
import com.example.hackathon.dto.CreateCategoryRequest;
import com.example.hackathon.dto.UpdateCategoryRequest;
import com.example.hackathon.service.CategoryService;
import jakarta.validation.Valid;
import java.util.List;
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
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
public class CategoryController {

	private final CategoryService categoryService;

	@GetMapping
	public ResponseEntity<List<CategoryDto>> findAll() {
		return ResponseEntity.ok(categoryService.findAll());
	}

	@PostMapping
	public ResponseEntity<CategoryDto> create(@Valid @RequestBody CreateCategoryRequest request) {
		return ResponseEntity.status(HttpStatus.CREATED).body(categoryService.create(request));
	}

	@PutMapping("/{id}")
	public ResponseEntity<CategoryDto> update(
			@PathVariable Long id, @Valid @RequestBody UpdateCategoryRequest request) {
		return ResponseEntity.ok(categoryService.update(id, request));
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<Void> delete(@PathVariable Long id) {
		categoryService.delete(id);
		return ResponseEntity.noContent().build();
	}
}
