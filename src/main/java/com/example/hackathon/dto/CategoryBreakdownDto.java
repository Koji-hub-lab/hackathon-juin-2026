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
public class CategoryBreakdownDto {

	private Long categoryId;
	private String categoryName;
	private long productCount;
	private long totalQuantity;
	private BigDecimal totalValue;
}
