"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  DollarSign,
  BarChart3,
  RefreshCw,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import CountUp from "react-countup";

interface KeyMetricsProps {
  inventoryData: any[];
  pricingData: any[];
}

export default function KeyMetrics({
  inventoryData,
  pricingData,
}: KeyMetricsProps) {
  const [metrics, setMetrics] = useState({
    inventoryTurnover: 0,
    stockoutRate: 0,
    holdingCost: 0,
    salesGrowth: 0,
    profitMargin: 0,
    customerSatisfaction: 0,
  });

  // Calculate metrics based on the data
  useEffect(() => {
    if (inventoryData.length === 0 || pricingData.length === 0) return;

    // Calculate inventory turnover
    const avgStockLevel =
      inventoryData.reduce(
        (sum, item) => sum + Number.parseInt(item["Stock Levels"] || "0"),
        0
      ) / inventoryData.length;
    const totalSales = pricingData.reduce(
      (sum, item) => sum + Number.parseInt(item["Sales Volume"] || "0"),
      0
    );
    const inventoryTurnover = totalSales / (avgStockLevel || 1);

    // Calculate stockout rate
    const stockoutItems = inventoryData.filter(
      (item) => Number.parseInt(item["Stockout Frequency"] || "0") > 0
    ).length;
    const stockoutRate = (stockoutItems / inventoryData.length) * 100;

    // Calculate average holding cost
    const holdingCost =
      pricingData.reduce(
        (sum, item) => sum + Number.parseFloat(item["Storage Cost"] || "0"),
        0
      ) / pricingData.length;

    // Calculate sales growth (simulated)
    const salesGrowth = 12.8; // Simulated value

    // Calculate profit margin
    const totalRevenue = pricingData.reduce((sum, item) => {
      const price = Number.parseFloat(item["Price"] || "0");
      const volume = Number.parseInt(item["Sales Volume"] || "0");
      return sum + price * volume;
    }, 0);

    const totalCost = pricingData.reduce((sum, item) => {
      const storageCost = Number.parseFloat(item["Storage Cost"] || "0");
      const volume = Number.parseInt(item["Sales Volume"] || "0");
      // Assume cost is 70% of price for demo
      const price = Number.parseFloat(item["Price"] || "0");
      const costPerUnit = price * 0.7;
      return sum + costPerUnit * volume + storageCost;
    }, 0);

    const profitMargin = ((totalRevenue - totalCost) / totalRevenue) * 100;

    // Calculate customer satisfaction (based on reviews)
    const totalReviews = pricingData.reduce(
      (sum, item) => sum + Number.parseInt(item["Customer Reviews"] || "0"),
      0
    );
    const customerSatisfaction = (totalReviews / pricingData.length) * 20; // Scale to 0-100

    setMetrics({
      inventoryTurnover,
      stockoutRate,
      holdingCost,
      salesGrowth,
      profitMargin,
      customerSatisfaction,
    });
  }, [inventoryData, pricingData]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  return (
    <div>
      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-2xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-fuchsia-500"
      >
        Key Performance Metrics
      </motion.h2>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        {/* Inventory Turnover Rate */}
        <motion.div
          variants={itemVariants}
          className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-sm border border-gray-700/50 rounded-xl p-5 transition-all duration-300 hover:border-purple-500/30 hover:shadow-lg hover:shadow-purple-500/10"
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-gray-400 text-sm">Inventory Turnover Rate</p>
              <div className="flex items-baseline mt-1">
                <h3 className="text-3xl font-bold text-white">
                  <CountUp
                    end={metrics.inventoryTurnover}
                    decimals={1}
                    duration={2}
                  />
                </h3>
                <span className="text-sm text-gray-400 ml-1">times/year</span>
              </div>
            </div>
            <div className="p-2 rounded-lg bg-purple-500/20 text-purple-300">
              <RefreshCw className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-2">
            <div className="flex items-center justify-between mb-1">
              <p className="text-gray-400 text-xs">Industry Average: 4.2</p>
              <div className="flex items-center text-green-400 text-xs">
                <TrendingUp className="w-3 h-3 mr-1" />
                <span>+12%</span>
              </div>
            </div>
            <Progress
              value={(metrics.inventoryTurnover / 8) * 100}
              className="h-1.5 bg-gray-700 bg-purple-500"
            />
          </div>
        </motion.div>

        {/* Stockout Rate */}
        <motion.div
          variants={itemVariants}
          className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-sm border border-gray-700/50 rounded-xl p-5 transition-all duration-300 hover:border-red-500/30 hover:shadow-lg hover:shadow-red-500/10"
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-gray-400 text-sm">Stockout Rate</p>
              <div className="flex items-baseline mt-1">
                <h3 className="text-3xl font-bold text-white">
                  <CountUp
                    end={metrics.stockoutRate}
                    decimals={1}
                    duration={2}
                  />
                </h3>
                <span className="text-sm text-gray-400 ml-1">%</span>
              </div>
            </div>
            <div className="p-2 rounded-lg bg-red-500/20 text-red-300">
              <AlertTriangle className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-2">
            <div className="flex items-center justify-between mb-1">
              <p className="text-gray-400 text-xs">Target: &lt;5%</p>
              <div className="flex items-center text-red-400 text-xs">
                <TrendingUp className="w-3 h-3 mr-1" />
                <span>+2.3%</span>
              </div>
            </div>
            <Progress
              value={metrics.stockoutRate}
              className="h-1.5 bg-gray-700 bg-red-500"
            />
          </div>
        </motion.div>

        {/* Average Inventory Holding Cost */}
        <motion.div
          variants={itemVariants}
          className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-sm border border-gray-700/50 rounded-xl p-5 transition-all duration-300 hover:border-blue-500/30 hover:shadow-lg hover:shadow-blue-500/10"
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-gray-400 text-sm">Avg. Holding Cost</p>
              <div className="flex items-baseline mt-1">
                <h3 className="text-3xl font-bold text-white">
                  $
                  <CountUp
                    end={metrics.holdingCost}
                    decimals={2}
                    duration={2}
                  />
                </h3>
                <span className="text-sm text-gray-400 ml-1">/unit</span>
              </div>
            </div>
            <div className="p-2 rounded-lg bg-blue-500/20 text-blue-300">
              <DollarSign className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-2">
            <div className="flex items-center justify-between mb-1">
              <p className="text-gray-400 text-xs">Budget: $6.00/unit</p>
              <div className="flex items-center text-green-400 text-xs">
                <TrendingDown className="w-3 h-3 mr-1" />
                <span>-8.3%</span>
              </div>
            </div>
            <Progress
              value={(metrics.holdingCost / 10) * 100}
              className="h-1.5 bg-gray-700"
            />
          </div>
        </motion.div>

        {/* Sales Growth */}
        <motion.div
          variants={itemVariants}
          className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-sm border border-gray-700/50 rounded-xl p-5 transition-all duration-300 hover:border-green-500/30 hover:shadow-lg hover:shadow-green-500/10"
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-gray-400 text-sm">Sales Growth</p>
              <div className="flex items-baseline mt-1">
                <h3 className="text-3xl font-bold text-white">
                  <CountUp
                    end={metrics.salesGrowth}
                    decimals={1}
                    duration={2}
                  />
                </h3>
                <span className="text-sm text-gray-400 ml-1">%</span>
              </div>
            </div>
            <div className="p-2 rounded-lg bg-green-500/20 text-green-300">
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-2">
            <div className="flex items-center justify-between mb-1">
              <p className="text-gray-400 text-xs">Target: 10%</p>
              <div className="flex items-center text-green-400 text-xs">
                <TrendingUp className="w-3 h-3 mr-1" />
                <span>+2.8%</span>
              </div>
            </div>
            <Progress
              value={(metrics.salesGrowth / 20) * 100}
              className="h-1.5 bg-gray-700 bg-green-500"
            />
          </div>
        </motion.div>

        {/* Profit Margin */}
        <motion.div
          variants={itemVariants}
          className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-sm border border-gray-700/50 rounded-xl p-5 transition-all duration-300 hover:border-amber-500/30 hover:shadow-lg hover:shadow-amber-500/10"
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-gray-400 text-sm">Profit Margin</p>
              <div className="flex items-baseline mt-1">
                <h3 className="text-3xl font-bold text-white">
                  <CountUp
                    end={metrics.profitMargin}
                    decimals={1}
                    duration={2}
                  />
                </h3>
                <span className="text-sm text-gray-400 ml-1">%</span>
              </div>
            </div>
            <div className="p-2 rounded-lg bg-amber-500/20 text-amber-300">
              <DollarSign className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-2">
            <div className="flex items-center justify-between mb-1">
              <p className="text-gray-400 text-xs">Target: 25%</p>
              <div className="flex items-center text-green-400 text-xs">
                <TrendingUp className="w-3 h-3 mr-1" />
                <span>+1.5%</span>
              </div>
            </div>
            <Progress
              value={(metrics.profitMargin / 40) * 100}
              className="h-1.5 bg-gray-700 bg-amber-500"
            />
          </div>
        </motion.div>

        {/* Customer Satisfaction */}
        <motion.div
          variants={itemVariants}
          className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-sm border border-gray-700/50 rounded-xl p-5 transition-all duration-300 hover:border-fuchsia-500/30 hover:shadow-lg hover:shadow-fuchsia-500/10"
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-gray-400 text-sm">Customer Satisfaction</p>
              <div className="flex items-baseline mt-1">
                <h3 className="text-3xl font-bold text-white">
                  <CountUp
                    end={metrics.customerSatisfaction}
                    decimals={1}
                    duration={2}
                  />
                </h3>
                <span className="text-sm text-gray-400 ml-1">/100</span>
              </div>
            </div>
            <div className="p-2 rounded-lg bg-fuchsia-500/20 text-fuchsia-300">
              <BarChart3 className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-2">
            <div className="flex items-center justify-between mb-1">
              <p className="text-gray-400 text-xs">Industry Avg: 72/100</p>
              <div className="flex items-center text-green-400 text-xs">
                <TrendingUp className="w-3 h-3 mr-1" />
                <span>+5.2%</span>
              </div>
            </div>
            <Progress
              value={metrics.customerSatisfaction}
              className="h-1.5 bg-gray-700 bg-fuchsia-500"
            />
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
