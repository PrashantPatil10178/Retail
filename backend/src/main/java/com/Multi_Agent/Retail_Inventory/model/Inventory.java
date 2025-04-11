package com.Multi_Agent.Retail_Inventory.model;

import jakarta.persistence.*;
import lombok.*;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonFormat;

import java.time.LocalDate;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Data
@Table(name = "inventory")
public class Inventory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "product_id")
    @JsonProperty("product_id")
    private String productId;

    @Column(name = "store_id")
    @JsonProperty("store_id")
    private String storeId;

    @Column(name = "stock_levels")
    @JsonProperty("stock_levels")
    private Integer stockLevels;

    @Column(name = "supplier_lead_time")
    @JsonProperty("supplier_lead_time")
    private Integer supplierLeadTime;

    @Column(name = "stockout_frequency")
    @JsonProperty("stockout_frequency")
    private Integer stockoutFrequency;

    @Column(name = "reorder_point")
    @JsonProperty("reorder_point")
    private Integer reorderPoint;

    @Column(name = "expiry_date")
    @JsonProperty("expiry_date")
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDate expiryDate;

    @Column(name = "warehouse_capacity")
    @JsonProperty("warehouse_capacity")
    private Integer warehouseCapacity;

    @Column(name = "order_fulfillment_time")
    @JsonProperty("order_fulfillment_time")
    private Integer orderFulfillmentTime;
}
