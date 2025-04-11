package com.Multi_Agent.Retail_Inventory.model;

import jakarta.persistence.*;
import lombok.*;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonFormat;

import java.time.LocalDate;

@Entity
@Data
public class Demand {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "product_id")
    @JsonProperty("product_id")
    private String productId;

    @Column(name = "date")
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate date;

    @Column(name = "store_id")
    @JsonProperty("store_id")
    private String storeId;

    @Column(name = "sales_quantity")
    @JsonProperty("sales_quantity")
    private Integer salesQuantity;

    @Column(name = "price")
    @JsonProperty("price")
    private Double price;

    @Column(name = "promotions")
    private String promotions;

    @Column(name = "seasonality_factors")
    @JsonProperty("seasonality_factors")
    private String seasonalityFactors;

    @Column(name = "external_factors")
    @JsonProperty("external_factors")
    private String externalFactors;

    @Column(name = "demand_trend")
    @JsonProperty("demand_trend")
    private String demandTrend;

    @Column(name = "customer_segments")
    @JsonProperty("customer_segments")
    private String customerSegments;
}
