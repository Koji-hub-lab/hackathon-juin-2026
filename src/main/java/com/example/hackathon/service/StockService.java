package com.example.hackathon.service;

import com.example.hackathon.dto.CreateStockMovementRequest;
import com.example.hackathon.dto.PageResponse;
import com.example.hackathon.dto.StockMovementDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class StockService {

	@Transactional
	public StockMovementDto recordMovement(CreateStockMovementRequest request) {
		throw new UnsupportedOperationException("Not implemented yet");
	}

	public PageResponse<StockMovementDto> findAll(int page, int size, Long productId) {
		throw new UnsupportedOperationException("Not implemented yet");
	}
}
