package com.Multi_Agent.Retail_Inventory.controller;

import com.Multi_Agent.Retail_Inventory.model.Demand;
import com.Multi_Agent.Retail_Inventory.model.Inventory;
import com.Multi_Agent.Retail_Inventory.model.Pricing;
import com.Multi_Agent.Retail_Inventory.service.TestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("api/prediction")
public class AIPredictionsController {
    @Autowired
    private TestService testService;
    @GetMapping
    public ResponseEntity<?> healthCheck(){
        return new ResponseEntity<>("ALL_GOOD", HttpStatus.OK);
    }

    @PostMapping("/forecast/{month}")
    public Map<String, Object> predictForecast(@RequestBody Demand demand, @PathVariable String month){
        return testService.predictSales(demand,month);
    }

    @PostMapping("/reorder/{predicatedSales}")
    public Map<String, Object> checkInventory(@RequestBody Inventory inventory, @PathVariable Integer predicatedSales){
        return testService.predictReorderAmt(inventory,predicatedSales);
    }

    @PostMapping("/optimize/{strategy}")
    public Map<String, Object> optimizePrice(@RequestBody Pricing pricing,@PathVariable String strategy){
        return testService.optimizePrice(pricing,strategy);
    }
}
