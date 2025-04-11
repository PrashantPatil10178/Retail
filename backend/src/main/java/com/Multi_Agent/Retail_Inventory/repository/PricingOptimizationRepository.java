package com.Multi_Agent.Retail_Inventory.repository;

import com.Multi_Agent.Retail_Inventory.model.Demand;
import com.Multi_Agent.Retail_Inventory.model.Inventory;
import com.Multi_Agent.Retail_Inventory.model.Pricing;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PricingOptimizationRepository extends JpaRepository<Pricing,Long> {
    List<Pricing> findByProductIdAndStoreId(String productId, String storeId);
    Pricing findTopByProductIdAndStoreIdOrderByIdDesc(String productId, String storeId);
}
