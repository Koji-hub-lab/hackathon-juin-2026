package com.example.hackathon.controller;

import com.example.hackathon.dto.AlertProductDto;
import com.example.hackathon.dto.DashboardSummaryDto;
import com.example.hackathon.service.DashboardService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

	private final DashboardService dashboardService;

	@GetMapping("/summary")
	public ResponseEntity<DashboardSummaryDto> getSummary() {
		return ResponseEntity.ok(dashboardService.getSummary());
	}

	@GetMapping("/alerts")
	public ResponseEntity<List<AlertProductDto>> getAlerts() {
		return ResponseEntity.ok(dashboardService.getAlerts());
	}
}
