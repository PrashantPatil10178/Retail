package com.Multi_Agent.Retail_Inventory.service;

import com.Multi_Agent.Retail_Inventory.model.Demand;
import com.Multi_Agent.Retail_Inventory.model.Inventory;
import com.Multi_Agent.Retail_Inventory.model.Pricing;
import com.Multi_Agent.Retail_Inventory.repository.InventoryMonitoringRepository;
import com.Multi_Agent.Retail_Inventory.repository.PricingOptimizationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Service
public class RetailAIPredictionsService {
    private static final String FORECAST_URL = "https://falcon-sincere-gelding.ngrok-free.app/forecast";
    private static final String INVENTORY_URL = "https://falcon-sincere-gelding.ngrok-free.app/inventory";
    private static final String PRICING_URL = "https://falcon-sincere-gelding.ngrok-free.app/priceOptimization";

    private final RestTemplate restTemplate = new RestTemplate();

    @Autowired
    private InventoryMonitoringRepository inventoryMonitoringRepository;

    @Autowired
    private PricingOptimizationRepository pricingOptimizationRepository;

    public Map<String, Object> allAIPredictions(Demand demand, String month, String strategy) {
        Map<String, Object> response = new HashMap<>();

        // Step 1: Forecast Prediction
        Map<String, Object> forecastResponse = predictSales(demand, month);
        Map<String, Object> forecastData = (Map<String, Object>) forecastResponse.get("forecast");

        if (forecastData != null && forecastData.containsKey("predicted_demand")) {
            response.put("forecast", forecastData);

            int predictedDemand = (int) forecastData.get("predicted_demand");

            // Step 2: Check Inventory
            Inventory latestInventory = inventoryMonitoringRepository
                    .findTopByProductIdAndStoreIdOrderByIdDesc(demand.getProductId(), demand.getStoreId());

            if (latestInventory != null) {
                int currentStock = latestInventory.getStockLevels();

                if (currentStock < predictedDemand) {
                    Map<String, Object> reorderResponse = predictReorderAmt(latestInventory, predictedDemand);
                    Map<String, Object> reorderData = (Map<String, Object>) reorderResponse.get("reorder_prediction");
                    response.put("inventory", reorderData);

                    Map<String, Object> pricingResponse = optimizePrice(demand, strategy);
                    Map<String, Object> pricingData = (Map<String, Object>) pricingResponse.get("prediction");
                    response.put("pricing", pricingData);
                } else {
                    response.put("inventory", Map.of("message", "Stock is sufficient, no reorder needed."));

                    Map<String, Object> pricingResponse = optimizePrice(demand, strategy);
                    Map<String, Object> pricingData = (Map<String, Object>) pricingResponse.get("prediction");
                    response.put("pricing", pricingData);
                }
            } else {
                response.put("inventory", Map.of("error", "Inventory data not available."));
            }

        } else {
            response.put("forecast", Map.of("error", "Forecast data not available."));
        }

        return response;
    }

    private Map<String, Object> optimizePrice(Demand demand, String strategy) {
        Pricing latestPricing = pricingOptimizationRepository
                .findTopByProductIdAndStoreIdOrderByIdDesc(demand.getProductId(), demand.getStoreId());
        String query = String.format(
                "Predict optimal price for Product ID: %s in Store ID: %s. Current Price: %.2f" +
                        "Considering Following Factors Competitor Prices: %.2f,Discounts: %.2f,Sales Volume: %d, Customer Reviews: %s, Return Rate: %.2f, Strorage Cost: %.2f, Elasticity Index: %.2f,Strategy :%s",
                latestPricing.getProductId(),latestPricing.getStoreId(),latestPricing.getPrice(),
                latestPricing.getCompetitorPrices(),latestPricing.getDiscounts(),
                latestPricing.getSalesVolume(),latestPricing.getCustomerReviews(),
                latestPricing.getReturnRate(), latestPricing.getStorageCost(),latestPricing.getElasticityIndex(),strategy
        );
        return getAIPrediction(PRICING_URL,query);
    }

    private Map<String, Object> predictReorderAmt(Inventory latestInveto, int predictedDemand) {
        String query = String.format(
                "Predict stock reorder amount for Product ID: %s in Store ID: %s. Supplier Lead Time: %d, Stockout Frequency: %d, " +
                        "Reorder Point: %d, Expiry Date: %s, Warehouse Capacity: %d, Order Fullfillment Time: %d, Predicted sales: %d.",
                latestInveto.getProductId(), latestInveto.getStoreId(),
                latestInveto.getSupplierLeadTime(),latestInveto.getStockoutFrequency(),
                latestInveto.getReorderPoint(),latestInveto.getExpiryDate(),
                latestInveto.getWarehouseCapacity(),latestInveto.getOrderFulfillmentTime(),predictedDemand
        );
        return getAIPrediction(INVENTORY_URL,query);
    }

    private Map<String, Object> predictSales(Demand demand, String month) {
            String query = String.format(
                    "Predict sales quantity for Product ID: %s in Store ID: %s, Current Sales: %d, Price: %.2f, " +
                            "Promotions: %s, Seasonality: %s, External Factors: %s, Demand Trend: %s, Customer Segment: %s of month: %s.",
                    demand.getProductId(), demand.getStoreId(), demand.getSalesQuantity(),
                    demand.getPrice(), demand.getPromotions(), demand.getSeasonalityFactors(),
                    demand.getExternalFactors(), demand.getDemandTrend(), demand.getCustomerSegments(),month
            );
            return getAIPrediction(FORECAST_URL, query);
    }
    private Map<String, Object> getAIPrediction(String url, String query) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            String requestBody = String.format("{\"query\": \"%s\"}", query);

            HttpEntity<String> request = new HttpEntity<>(requestBody, headers);
            ResponseEntity<Map> response = restTemplate.exchange(url, HttpMethod.POST, request, Map.class);

            if (response.getBody() != null) {
                return response.getBody();
            }
        } catch (Exception e) {
            System.err.println("Error calling AI Model: " + e.getMessage());
        }
        return Map.of("error", "Unable to get AI prediction.");
    }
}
