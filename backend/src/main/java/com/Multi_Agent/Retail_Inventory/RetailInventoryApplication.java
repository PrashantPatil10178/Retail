package com.Multi_Agent.Retail_Inventory;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class RetailInventoryApplication {

	public static void main(String[] args) {
		SpringApplication.run(RetailInventoryApplication.class, args);
	}

}
