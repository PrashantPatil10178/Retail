package com.Multi_Agent.Retail_Inventory.repository;

import com.Multi_Agent.Retail_Inventory.model.Demand;
import com.Multi_Agent.Retail_Inventory.model.Inventory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface InventoryMonitoringRepository extends JpaRepository<Inventory,Long> {
    List<Inventory> findByProductIdAndStoreId(String productId, String storeId);
    Inventory findTopByProductIdAndStoreIdOrderByIdDesc(String productId,String storeId);
}
