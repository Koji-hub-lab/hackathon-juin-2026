package com.example.hackathon.dto;

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
public class AlertProductDto {

	private Long id;
	private String name;
	private String sku;
	private Integer quantity;
	private Integer minThreshold;
	private AlertStatus alertStatus;
	private String categoryName;
}
