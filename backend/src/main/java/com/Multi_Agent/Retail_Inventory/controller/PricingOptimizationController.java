package com.Multi_Agent.Retail_Inventory.controller;

import com.Multi_Agent.Retail_Inventory.model.Inventory;
import com.Multi_Agent.Retail_Inventory.model.Pricing;
import com.Multi_Agent.Retail_Inventory.service.InventoryMonitoringService;
import com.Multi_Agent.Retail_Inventory.service.PricingOptimizationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/pricing")
public class PricingOptimizationController {
    @Autowired
    private PricingOptimizationService pricingOptimizationService;
    @PostMapping("/add")
    public ResponseEntity<?> createProduct(@RequestBody Pricing pricing){
         pricingOptimizationService.addProduct(pricing);
        return new ResponseEntity<>("Product Added Successfully", HttpStatus.CREATED);
    }
    @GetMapping("/history/{productId}/{storeId}")
    public ResponseEntity<List<Pricing>> getAllStockLevels(@PathVariable String productId, @PathVariable String storeId) {
        return ResponseEntity.ok(pricingOptimizationService.getAllPrices(productId, storeId));
    }
}
