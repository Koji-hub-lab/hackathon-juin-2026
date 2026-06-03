package com.example.hackathon.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
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
public class CreateProductRequest {

	@NotBlank
	@Size(max = 200)
	private String name;

	@NotBlank
	@Size(max = 50)
	private String sku;

	private String description;

	@NotNull
	@Min(0)
	private BigDecimal price;

	@NotNull
	@Min(0)
	private Integer quantity;

	@NotNull
	@Min(0)
	private Integer minThreshold;

	@NotNull
	private Long categoryId;
}
