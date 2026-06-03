package com.example.hackathon.controller;

import com.example.hackathon.dto.CreateStockMovementRequest;
import com.example.hackathon.dto.PageResponse;
import com.example.hackathon.dto.StockMovementDto;
import com.example.hackathon.service.StockService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/stock/movements")
@RequiredArgsConstructor
public class StockMovementController {

	private final StockService stockService;

	@PostMapping
	public ResponseEntity<StockMovementDto> recordMovement(
			@Valid @RequestBody CreateStockMovementRequest request) {
		return ResponseEntity.status(HttpStatus.CREATED).body(stockService.recordMovement(request));
	}

	@GetMapping
	public ResponseEntity<PageResponse<StockMovementDto>> findAll(
			@RequestParam(defaultValue = "0") int page,
			@RequestParam(defaultValue = "20") int size,
			@RequestParam(required = false) Long productId) {
		return ResponseEntity.ok(stockService.findAll(page, size, productId));
	}
}
