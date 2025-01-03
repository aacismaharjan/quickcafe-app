package com.example.demo.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;


@Entity
@Table(name = "tbl_order_details")
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
public class OrderDetail {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	@ManyToOne(fetch = FetchType.EAGER)
	@NotNull
	@JoinColumn(name = "menu_item_id")
	private MenuItem menuItem;
	
	private int quantity;
	private double unitPrice;

	@OneToOne(mappedBy = "orderDetail", fetch = FetchType.EAGER)
	private Review review;
}