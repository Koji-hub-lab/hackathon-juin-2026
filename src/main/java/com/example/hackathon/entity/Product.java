package com.example.hackathon.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;
import java.util.ArrayList;
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
@Entity
@Table(
		name = "product",
		indexes = {
			@Index(name = "idx_product_category", columnList = "category_id"),
			@Index(name = "idx_product_sku", columnList = "sku"),
			@Index(name = "idx_product_quantity", columnList = "quantity")
		})
public class Product extends AuditableEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@NotBlank
	@Size(max = 200)
	@Column(nullable = false, length = 200)
	private String name;

	@NotBlank
	@Size(max = 50)
	@Column(nullable = false, unique = true, length = 50)
	private String sku;

	@Column(columnDefinition = "TEXT")
	private String description;

	@NotNull
	@Min(0)
	@Column(nullable = false, precision = 10, scale = 2)
	private BigDecimal price;

	@NotNull
	@Min(0)
	@Column(nullable = false)
	private Integer quantity;

	@NotNull
	@Min(0)
	@Column(name = "min_threshold", nullable = false)
	private Integer minThreshold;

	@NotNull
	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "category_id", nullable = false)
	private Category category;

	@Builder.Default
	@OneToMany(mappedBy = "product")
	private List<StockMovement> stockMovements = new ArrayList<>();
}
