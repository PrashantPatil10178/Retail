package com.Multi_Agent.Retail_Inventory.model;

import jakarta.persistence.*;
import lombok.*;
import com.fasterxml.jackson.annotation.JsonProperty;

@Entity
@Data
@Table(name = "pricing")
public class Pricing {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "product_id")
    @JsonProperty("product_id")
    private String productId;

    @Column(name = "store_id")
    @JsonProperty("store_id")
    private String storeId;

    @Column(name = "price")
    @JsonProperty("price")
    private Double price;

    @Column(name = "competitor_prices")
    @JsonProperty("competitor_prices")
    private Double competitorPrices;

    @Column(name = "discounts")
    @JsonProperty("discounts")
    private Double discounts;

    @Column(name = "sales_volume")
    @JsonProperty("sales_volume")
    private Integer salesVolume;

    @Column(name = "customer_reviews")
    @JsonProperty("customer_reviews")
    private Integer customerReviews;

    @Column(name = "return_rate")
    @JsonProperty("return_rate")
    private Double returnRate;

    @Column(name = "storage_cost")
    @JsonProperty("storage_cost")
    private Double storageCost;

    @Column(name = "elasticity_index")
    @JsonProperty("elasticity_index")
    private Double elasticityIndex;
}
