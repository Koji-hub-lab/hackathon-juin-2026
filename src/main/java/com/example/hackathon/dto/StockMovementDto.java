package com.example.hackathon.dto;

import com.example.hackathon.entity.MovementType;
import java.time.LocalDateTime;
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
public class StockMovementDto {

	private Long id;
	private Long productId;
	private MovementType type;
	private Integer quantity;
	private String reason;
	private Integer newQuantity;
	private LocalDateTime createdAt;
}
