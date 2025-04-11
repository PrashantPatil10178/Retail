package com.Multi_Agent.Retail_Inventory.service;

import com.Multi_Agent.Retail_Inventory.model.Demand;
import com.Multi_Agent.Retail_Inventory.model.Inventory;
import com.Multi_Agent.Retail_Inventory.model.Pricing;
import com.Multi_Agent.Retail_Inventory.model.ProcessedForecastResult;
import com.Multi_Agent.Retail_Inventory.repository.DemandForecastingRepository;
import com.Multi_Agent.Retail_Inventory.repository.InventoryMonitoringRepository;
import com.Multi_Agent.Retail_Inventory.repository.PricingOptimizationRepository;
import com.Multi_Agent.Retail_Inventory.repository.ProcessedForecastResultRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AIModelService {

    private static final String FORECAST_URL = "https://falcon-sincere-gelding.ngrok-free.app/forecast";
    private static final String INVENTORY_URL = "https://falcon-sincere-gelding.ngrok-free.app/inventory";
    private static final String PRICING_URL = "https://falcon-sincere-gelding.ngrok-free.app/priceOptimization";


    @Autowired
    private DemandForecastingRepository demandForecastingRepository;
    @Autowired
    private ProcessedForecastResultRepository processedForecastResultRepository;
    @Autowired
    private PricingOptimizationRepository pricingOptimizationRepository;
    @Autowired
    private InventoryMonitoringRepository inventoryMonitoringRepository;

    private final RestTemplate restTemplate = new RestTemplate();


    @Scheduled(cron = "0 0 3 1 * *")
    @Transactional
    public void runScheduledForecasting() {
        List<Demand> allDemands =demandForecastingRepository.findAll();
        String month = LocalDate.now().getMonth().name();
        month = month.charAt(0) + month.substring(1).toLowerCase();
        String strategy="increase";

        for (Demand demand : allDemands) {
            String productId = demand.getProductId();
            String storeId = demand.getStoreId();

            Map<String, Object> result = allAIPredictions(demand, month, strategy);

            // Parse and store result
            Map<String, Object> forecastData = (Map<String, Object>) result.get("forecast");
            Map<String, Object> inventoryData = (Map<String, Object>) result.get("inventory");
            Map<String, Object> pricingData = (Map<String, Object>) result.get("pricing");

            ProcessedForecastResult processedResult = new ProcessedForecastResult();
            processedResult.setProductId(productId);
            processedResult.setStoreId(storeId);
            processedResult.setMonth(month);

            processedResult.setPredictedDemand((Integer) forecastData.get("predicted_demand"));
            List<Integer> interval = (List<Integer>) forecastData.get("confidence_interval");
            processedResult.setLowerConfidence(interval.get(0));
            processedResult.setUpperConfidence(interval.get(1));
            processedResult.setForecastMethod((String) forecastData.get("method_used"));

            processedResult.setRecommendedOrder((Integer) inventoryData.get("recommended_order"));
            processedResult.setReorderJustification((String) inventoryData.get("justification"));

            processedResult.setCurrentPrice(((Number) pricingData.get("current_price")).doubleValue());
            processedResult.setSuggestedPrice(((Number) pricingData.get("suggested_price")).doubleValue());
            processedResult.setProjectedProfitMargin((String) pricingData.get("projected_profit_margin"));
            processedResult.setStrategyAlignment((String) pricingData.get("strategy_alignment"));
            processedResult.setRiskLevel((String) pricingData.get("risk_level"));

            processedResult.setProcessedAt(LocalDateTime.now());

            processedForecastResultRepository.save(processedResult);
        }
    }
    public Map<String, Object> allAIPredictions(Demand demand, String month,String strategy) {
        Map<String, Object>response=new HashMap<>();

        Map<String, Object>forecastedResponse=predictSales(demand,month);
        if(forecastedResponse!=null&& forecastedResponse.containsKey("predicted_demand")){
            response.put("forecast",forecastedResponse);
            int predictedDemand=(int)forecastedResponse.get("predicted_demand");
            Inventory latestInventory = inventoryMonitoringRepository
                    .findTopByProductIdAndStoreIdOrderByIdDesc(demand.getProductId(), demand.getStoreId());
            if(latestInventory!=null) {
                int currentStock = latestInventory.getStockLevels();
                Map<String, Object> reorderAmount;
                if (currentStock < predictedDemand) {
                    reorderAmount = predictReorderAmt(latestInventory, predictedDemand);
                    response.put("inventory",reorderAmount);

                    Map<String, Object> pricingResponse = optimizePrice(demand,strategy);
                    response.put("pricing", pricingResponse);
                }else{
                    response.put("inventory", "Stock is sufficient, no reorder needed.");
                    strategy="stable or decrease";
                    Map<String, Object> pricingResponse = optimizePrice(demand,strategy);
                    response.put("pricing", pricingResponse);
                }
            }else {
                response.put("inventory", "Inventory data not available.");
            }
        }else{
            response.put("forecast", "Forecast data not available.");
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
