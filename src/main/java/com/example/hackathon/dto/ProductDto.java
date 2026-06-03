package com.example.hackathon.dto;

import java.math.BigDecimal;
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
public class ProductDto {

	private Long id;
	private String name;
	private String sku;
	private String description;
	private BigDecimal price;
	private Integer quantity;
	private Integer minThreshold;
	private Long categoryId;
	private String categoryName;
	private AlertStatus alertStatus;
}
