package com.Multi_Agent.Retail_Inventory.controller;

import com.Multi_Agent.Retail_Inventory.model.ProcessedForecastResult;
import com.Multi_Agent.Retail_Inventory.repository.ProcessedForecastResultRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/auto/schedule")
public class CronController {
    @Autowired
    private ProcessedForecastResultRepository processedForecastResultRepository;
    @GetMapping("/monthly")
    public List<ProcessedForecastResult> getTodayResults() {
        LocalDate today = LocalDate.now();
        return processedForecastResultRepository.findByProcessedAtBetween(
                today.atStartOfDay(),
                today.plusDays(1).atStartOfDay()
        );
    }

}
