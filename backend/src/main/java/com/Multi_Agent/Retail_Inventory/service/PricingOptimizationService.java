package com.Multi_Agent.Retail_Inventory.service;

import com.Multi_Agent.Retail_Inventory.model.Inventory;
import com.Multi_Agent.Retail_Inventory.model.Pricing;
import com.Multi_Agent.Retail_Inventory.repository.PricingOptimizationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PricingOptimizationService {
    @Autowired
    private PricingOptimizationRepository pricingOptimizationRepository;
    @Autowired
    private AIModelService AIModelService;
    public ResponseEntity<?> addProduct(Pricing pricing) {
        pricingOptimizationRepository.save(pricing);
        return new ResponseEntity<>(pricing, HttpStatus.OK);
    }

    public List<Pricing> getAllPrices(String productId, String storeId) {
        return pricingOptimizationRepository.findByProductIdAndStoreId(productId,storeId);
    }

//    public ResponseEntity<?> optimizePricing(String productId, String storeId, String strategy) {
//        Pricing latestPricing=pricingOptimizationRepository.findTopByProductIdAndStoreIdOrderByIdDesc(productId,storeId);
//        if(latestPricing!=null){
//            double optimizedPrice= AIModelService.getOptimizedPrice(
//                    productId,storeId,latestPricing.getPrice(),
//                    latestPricing.getCompetitorPrices(),latestPricing.getDiscounts(),
//                    latestPricing.getSalesVolume(),latestPricing.getCustomerReviews(),
//                    latestPricing.getReturnRate(), latestPricing.getStorageCost(),latestPricing.getElasticityIndex()
//            );
//            latestPricing.setPrice(optimizedPrice);
//            pricingOptimizationRepository.save(latestPricing);
//            return new ResponseEntity<>(latestPricing,HttpStatus.OK);
//        }
//        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
//    }
}
