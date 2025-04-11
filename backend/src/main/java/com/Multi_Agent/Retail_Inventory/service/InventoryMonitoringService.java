package com.Multi_Agent.Retail_Inventory.service;

import com.Multi_Agent.Retail_Inventory.model.Inventory;
import com.Multi_Agent.Retail_Inventory.repository.InventoryMonitoringRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class InventoryMonitoringService {
    @Autowired
    private InventoryMonitoringRepository inventoryMonitoringRepository;
    @Autowired
    private PricingOptimizationService pricingOptimizationService;
    @Autowired
    private AIModelService AIModelService;
    public ResponseEntity<?> addProduct(Inventory inventory) {
        inventoryMonitoringRepository.save(inventory);
        return new ResponseEntity<>(inventory, HttpStatus.OK);
    }

    public List<Inventory> getAllStockLevels(String productId, String storeId) {
        return inventoryMonitoringRepository.findByProductIdAndStoreId(productId,storeId);
    }

//    public ResponseEntity<?> checkInventory(String productId, String storeId, int predictedSales) {
//        Inventory latestInveto=inventoryMonitoringRepository.findTopByProductIdAndStoreIdOrderByIdDesc(productId,storeId);
//        if(latestInveto!=null){
//            Integer currentStockLevel=latestInveto.getStockLevels();
//            int reorderAmt= AIModelService.predictReorderAmount(
//                    productId, storeId, currentStockLevel, predictedSales,
//                    latestInveto.getSupplierLeadTime(),latestInveto.getStockoutFrequency(),
//                    latestInveto.getReorderPoint(),latestInveto.getExpiryDate(),
//                    latestInveto.getWarehouseCapacity(),latestInveto.getOrderFulfillmentTime()
//            );
//            if(currentStockLevel>predictedSales){
//                highStock(latestInveto);
//            }else{
//                lowStock(latestInveto,reorderAmt);
//            }
//            inventoryMonitoringRepository.save(latestInveto);
//            return new ResponseEntity<>(latestInveto,HttpStatus.OK);
//        }
//        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
//    }
//    private void lowStock(Inventory inventory, int reorderAmount) {
//        inventory.setStockLevels(inventory.getStockLevels() + reorderAmount);
//        pricingOptimizationService.optimizePricing(inventory.getProductId(), inventory.getStoreId(), "increase");
//    }
//
//    private void highStock(Inventory inventory) {
//        pricingOptimizationService.optimizePricing(inventory.getProductId(), inventory.getStoreId(), "decrease");
//    }


}
