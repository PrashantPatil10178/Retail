package com.Multi_Agent.Retail_Inventory.controller;

import com.Multi_Agent.Retail_Inventory.model.Demand;
import com.Multi_Agent.Retail_Inventory.service.RetailAIPredictionsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("api/retail")
public class RetailAIPredictionsController {
    @Autowired
    private RetailAIPredictionsService retailAIPredictionsService;

    @PostMapping("all/predictions")
    public Map<String,Object> retailAIPredictions(@RequestBody Demand demand, @RequestParam String month, @RequestParam String strategy){
        return retailAIPredictionsService.allAIPredictions(demand,month,strategy);
    }
}
