package com.Multi_Agent.Retail_Inventory.service;

import com.Multi_Agent.Retail_Inventory.model.Demand;
import com.Multi_Agent.Retail_Inventory.repository.DemandForecastingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DemandForecastingService {
    @Autowired
    private DemandForecastingRepository demandForecastingRepository;
    @Autowired
    private AIModelService AIModelService;
    @Autowired
    private InventoryMonitoringService inventoryMonitoringService;
    public ResponseEntity<?> updateOrAddProduct(Demand demand) {
        demandForecastingRepository.save(demand);
        return new ResponseEntity<>(demand, HttpStatus.OK);
    }

    public List<Demand> getHistoricalSalesData(String productId, String storeId) {
        return demandForecastingRepository.findByProductIdAndStoreId(productId, storeId);
    }

//    public Demand predictSales(Demand demand) {
//        int predictedSales= AIModelService.predictSalesQuantity(
//                demand.getProductId(),demand.getStoreId(),demand.getSalesQuantity(),
//                demand.getPrice(),"Yes".equalsIgnoreCase(demand.getPromotions()),
//                demand.getSeasonalityFactors(), demand.getExternalFactors(),
//                demand.getDemandTrend(), demand.getCustomerSegments()
//        );
//        demand.setSalesQuantity(predictedSales);
//        demandForecastingRepository.save(demand);
//
//        inventoryMonitoringService.checkInventory(demand.getProductId(),demand.getStoreId(),predictedSales);
//        return demand;
//    }
}
