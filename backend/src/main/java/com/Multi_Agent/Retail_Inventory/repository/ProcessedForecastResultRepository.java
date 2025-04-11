package com.Multi_Agent.Retail_Inventory.repository;

import com.Multi_Agent.Retail_Inventory.model.ProcessedForecastResult;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface ProcessedForecastResultRepository extends JpaRepository<ProcessedForecastResult,String> {
    List<ProcessedForecastResult> findByProcessedAtBetween(LocalDateTime localDateTime, LocalDateTime localDateTime1);
}
