package com.example.hackathon.dto;

import java.math.BigDecimal;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardSummaryDto {

	private long totalProducts;
	private long totalStockUnits;
	private BigDecimal totalStockValue;
	private long alertCount;
	private long outOfStockCount;
	private List<CategoryBreakdownDto> categoryBreakdown;
}
