package com.Multi_Agent.Retail_Inventory.repository;

import com.Multi_Agent.Retail_Inventory.model.Demand;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DemandForecastingRepository extends JpaRepository<Demand,Long> {

    List<Demand> findByProductIdAndStoreId(String productId, String storeId);
}
