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
import java.util.Map;

@Service
public class TestService {
    private static final String FORECAST_URL = "https://falcon-sincere-gelding.ngrok-free.app/forecast";
    private static final String INVENTORY_URL = "https://falcon-sincere-gelding.ngrok-free.app/inventory";
    private static final String PRICING_URL = "https://falcon-sincere-gelding.ngrok-free.app/priceOptimization";

    private final RestTemplate restTemplate = new RestTemplate();
    @Autowired
    private InventoryMonitoringRepository inventoryMonitoringRepository;
    @Autowired
    private PricingOptimizationRepository pricingOptimizationRepository;

    public Map<String, Object> optimizePrice(Pricing pricing, String strategy) {
        Pricing latestPricing = pricingOptimizationRepository
                .findTopByProductIdAndStoreIdOrderByIdDesc(pricing.getProductId(), pricing.getStoreId());
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

    public Map<String, Object> predictReorderAmt(Inventory latestInveto, int predictedDemand) {
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

    public Map<String, Object> predictSales(Demand demand, String month) {
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
//    public String predictForecast(Demand demand,String month) {
//        String predictedSales=predictSales(demand.getProductId(),demand.getStoreId(),demand.getSalesQuantity(),
//                demand.getPrice(),"Yes".equalsIgnoreCase(demand.getPromotions()),
//                demand.getSeasonalityFactors(), demand.getExternalFactors(),
//                demand.getDemandTrend(), demand.getCustomerSegments(),month);
//        return predictedSales;
//    }
//
//    private String predictSales(String productId, String storeId, Integer salesQuantity, Double price, boolean promotions, String seasonalityFactors, String externalFactors, String demandTrend, String customerSegments, String month) {
//        String query = String.format(
//                "Predict sales quantity for Product ID: %s in Store ID: %s. Current Sales: %d, Price: %.2f, " +
//                        "Promotions: %b, Seasonality: %s, External Factors: %s, Demand Trend: %s, Customer Segment: %s of month: %s.",
//                productId, storeId, salesQuantity, price, promotions, seasonalityFactors, externalFactors, demandTrend, customerSegments,month
//        );
//
//        return getAIPrediction(MODEL_URL,query);
//
//    }
//
//    private String getAIPrediction(String url,String query ) {
//        try{
//            HttpHeaders headers = new HttpHeaders();
//            headers.setContentType(MediaType.APPLICATION_JSON);
//            String requestBody = String.format("{\"query\": \"%s\"}", query);
//            HttpEntity<String>request=new HttpEntity<>(requestBody,headers);
//            ResponseEntity<String>response=restTemplate.exchange(url, HttpMethod.POST, request, String.class);
//            if(response.getBody()!=null){
//                return response.getBody();
//            }
//        }catch (Exception e){
//            System.err.println("Error calling AI Model: " + e.getMessage());
//        }
//        return "can't predict right now";
//    }
//
//    public String checkInventory(Inventory inventory, String productId,String storeId,Integer predicatedSales) {
//        Inventory latestInveto=inventoryMonitoringRepository.findTopByProductIdAndStoreIdOrderByIdDesc(productId,storeId);
//        if(latestInveto!=null){
//            String reorderAmt=predictReorderAmt(productId, storeId,
//                    latestInveto.getSupplierLeadTime(),latestInveto.getStockoutFrequency(),
//                    latestInveto.getReorderPoint(),latestInveto.getExpiryDate(),
//                    latestInveto.getWarehouseCapacity(),latestInveto.getOrderFulfillmentTime(),predicatedSales);
//            return reorderAmt;
//        }
//        return "Not Availabel";
//    }
//
//    private String predictReorderAmt(String productId, String storeId, Integer supplierLeadTime, Integer stockoutFrequency, Integer reorderPoint, LocalDate expiryDate, Integer warehouseCapacity, Integer orderFulfillmentTime, Integer predicatedSales) {
//        String query = String.format(
//                "Predict stock reorder amount for Product ID: %s in Store ID: %s. Supplier Lead Time: %d, Stockout Frequency: %d, " +
//                        "Reorder Point: %d, Expiry Date: %s, Warehouse Capacity: %d, Order Fullfillment Time: %d, Predicted sales: %d.",
//                productId, storeId, supplierLeadTime, stockoutFrequency, reorderPoint, expiryDate, warehouseCapacity, orderFulfillmentTime, predicatedSales
//        );
//        return getAIPrediction(REORDER_URL,query);
//    }
//
//    public String optimizePrice(Inventory inventory, String productId, String storeId, String strategy) {
//        Pricing latestPricing =pricingOptimizationRepository.findTopByProductIdAndStoreIdOrderByIdDesc(productId,storeId);
//        if(latestPricing!=null){
//            String optimalPrice=predictpricing(productId,storeId,latestPricing.getPrice(),
//                    latestPricing.getCompetitorPrices(),latestPricing.getDiscounts(),
//                    latestPricing.getSalesVolume(),latestPricing.getCustomerReviews(),
//                    latestPricing.getReturnRate(), latestPricing.getStorageCost(),latestPricing.getElasticityIndex(),strategy);
//            return optimalPrice;
//        }
//        return "Not Availabel";
//    }
//
//    private String predictpricing(String productId, String storeId, Double price, Double competitorPrices, Double discounts, Integer salesVolume, Integer customerReviews, Double returnRate, Double storageCost, Double elasticityIndex, String strategy) {
//        String query = String.format(
//                "Predict optimal price for Product ID: %s in Store ID: %s. Current Price: %.2f" +
//                        "Considering Following Factors Competitor Prices: %.2f,Discounts: %.2f,Sales Volume: %d, Customer Reviews: %s, Return Rate: %.2f, Strorage Cost: %.2f, Elasticity Index: %.2f,Strategy :%s",
//                productId, storeId, price, competitorPrices, discounts, salesVolume, customerReviews, returnRate, storageCost,elasticityIndex,strategy
//        );
//        return getAIPrediction(PRICING_URL,query);
//    }
}
