package com.Multi_Agent.Retail_Inventory.controller;

import com.Multi_Agent.Retail_Inventory.model.Demand;
import com.Multi_Agent.Retail_Inventory.model.Inventory;
import com.Multi_Agent.Retail_Inventory.service.InventoryMonitoringService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/inventory")
public class InventoryMonitoringController {
    @Autowired
    private InventoryMonitoringService inventoryMonitoringService;
    @PostMapping("/add")
    public ResponseEntity<?> createProduct(@RequestBody Inventory inventory){
        inventoryMonitoringService.addProduct(inventory);
        return new ResponseEntity<>("Product Added Successfully", HttpStatus.CREATED);
    }

    @GetMapping("/history/{productId}/{storeId}")
    public ResponseEntity<List<Inventory>> getAllStockLevels(@PathVariable String productId, @PathVariable String storeId) {
        return ResponseEntity.ok(inventoryMonitoringService.getAllStockLevels(productId, storeId));
    }
}
