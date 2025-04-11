package com.Multi_Agent.Retail_Inventory.controller;

import com.Multi_Agent.Retail_Inventory.model.Demand;
import com.Multi_Agent.Retail_Inventory.service.DemandForecastingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/demand")
public class DemandForecastingController {

    @Autowired
    private DemandForecastingService demandForecastingService;

    @PostMapping("/add")
    public ResponseEntity<?> updateProduct(@RequestBody Demand demand){
         demandForecastingService.updateOrAddProduct(demand);
         return new ResponseEntity<>("Product Added Successfully", HttpStatus.CREATED);
    }

    @GetMapping("/history/{productId}/{storeId}")
    public ResponseEntity<List<Demand>> getHistoricalSalesData(@PathVariable String productId, @PathVariable String storeId) {
        return ResponseEntity.ok(demandForecastingService.getHistoricalSalesData(productId, storeId));
    }

}
