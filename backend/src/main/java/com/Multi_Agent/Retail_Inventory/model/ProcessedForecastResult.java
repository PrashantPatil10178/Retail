package com.Multi_Agent.Retail_Inventory.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Data
public class ProcessedForecastResult {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String productId;
    private String storeId;
    private String month;

    private Integer predictedDemand;
    private Integer lowerConfidence;
    private Integer upperConfidence;
    private String forecastMethod;

    private Integer recommendedOrder;
    private String reorderJustification;

    private Double currentPrice;
    private Double suggestedPrice;
    private String projectedProfitMargin;
    private String strategyAlignment;
    private String riskLevel;

    private LocalDateTime processedAt;

}

