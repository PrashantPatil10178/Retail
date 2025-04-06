"use client";

import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Lightbulb,
  TrendingUp,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  ArrowRight,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface RecommendationsProps {
  inventoryData: any[];
  pricingData: any[];
}

export default function Recommendations({
  inventoryData,
  pricingData,
}: RecommendationsProps) {
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

  // Generate inventory recommendations
  const generateInventoryRecommendations = () => {
    // Find low stock items
    const lowStockItems = inventoryData.filter(
      (item) =>
        Number.parseInt(item["Stock Levels"] || "0") <
        Number.parseInt(item["Reorder Point"] || "0")
    ).length;

    // Find high stockout frequency stores
    const highStockoutStores = [
      ...new Set(
        inventoryData
          .filter(
            (item) => Number.parseInt(item["Stockout Frequency"] || "0") > 15
          )
          .map((item) => item["Store ID"])
      ),
    ];

    // Find long lead time suppliers
    const longLeadTimeItems = inventoryData.filter(
      (item) => Number.parseInt(item["Supplier Lead Time (days)"] || "0") > 15
    ).length;

    return {
      lowStockItems,
      highStockoutStores,
      longLeadTimeItems,
    };
  };

  // Generate pricing recommendations
  const generatePricingRecommendations = () => {
    // Find products with high elasticity (price sensitive)
    const highElasticityProducts = pricingData.filter(
      (item) => Number.parseFloat(item["Elasticity Index"] || "0") > 1.2
    ).length;

    // Find products with low elasticity (not price sensitive)
    const lowElasticityProducts = pricingData.filter(
      (item) => Number.parseFloat(item["Elasticity Index"] || "0") < 0.8
    ).length;

    // Find products with high competitor price difference
    const competitivePriceProducts = pricingData.filter((item) => {
      const price = Number.parseFloat(item["Price"] || "0");
      const competitorPrice = Number.parseFloat(
        item["Competitor Prices"] || "0"
      );
      return price > competitorPrice * 1.1; // Our price is 10% higher than competitor
    }).length;

    return {
      highElasticityProducts,
      lowElasticityProducts,
      competitivePriceProducts,
    };
  };

  const inventoryRecs = generateInventoryRecommendations();
  const pricingRecs = generatePricingRecommendations();

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible">
      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-2xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-fuchsia-500"
      >
        AI-Powered Recommendations
      </motion.h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Inventory Recommendations */}
        <motion.div variants={itemVariants}>
          <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700/50 rounded-xl h-full">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Lightbulb className="w-5 h-5 mr-2 text-purple-400" />
                Inventory Optimization Insights
              </CardTitle>
              <CardDescription>
                AI-generated recommendations to improve inventory management
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/20">
                <div className="flex items-start">
                  <AlertTriangle className="w-5 h-5 text-purple-400 mt-0.5 mr-2 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-purple-400 mb-1">
                      Low Stock Alert
                    </h4>
                    <p className="text-gray-300 text-sm">
                      {inventoryRecs.lowStockItems} products are below reorder
                      point and require immediate attention.
                    </p>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-xs text-gray-400">
                        Urgency Level
                      </span>
                      <Progress value={85} className="w-32 h-1.5 bg-gray-700" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
                <div className="flex items-start">
                  <TrendingUp className="w-5 h-5 text-blue-400 mt-0.5 mr-2 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-blue-400 mb-1">
                      Stockout Prevention
                    </h4>
                    <p className="text-gray-300 text-sm">
                      {inventoryRecs.highStockoutStores.length} stores have high
                      stockout frequency. Consider increasing safety stock
                      levels by 20%.
                    </p>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-xs text-gray-400">
                        Potential Impact
                      </span>
                      <Progress value={75} className="w-32 h-1.5 bg-gray-700" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/20">
                <div className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-amber-400 mt-0.5 mr-2 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-amber-400 mb-1">
                      Supplier Optimization
                    </h4>
                    <p className="text-gray-300 text-sm">
                      {inventoryRecs.longLeadTimeItems} products have lead times
                      exceeding 15 days. Negotiate with suppliers or find
                      alternative sources.
                    </p>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-xs text-gray-400">
                        Cost Saving Potential
                      </span>
                      <Progress value={60} className="w-32 h-1.5 bg-gray-700" />
                    </div>
                  </div>
                </div>
              </div>

              <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white">
                Generate Detailed Inventory Plan
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Pricing Recommendations */}
        <motion.div variants={itemVariants}>
          <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700/50 rounded-xl h-full">
            <CardHeader>
              <CardTitle className="flex items-center">
                <DollarSign className="w-5 h-5 mr-2 text-green-400" />
                Pricing Strategy Recommendations
              </CardTitle>
              <CardDescription>
                Data-driven insights to optimize pricing and maximize revenue
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                <div className="flex items-start">
                  <TrendingUp className="w-5 h-5 text-green-400 mt-0.5 mr-2 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-green-400 mb-1">
                      Price Increase Opportunity
                    </h4>
                    <p className="text-gray-300 text-sm">
                      {pricingRecs.lowElasticityProducts} products have low
                      price elasticity. Consider increasing prices by 5-10% to
                      boost margins.
                    </p>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-xs text-gray-400">
                        Revenue Impact
                      </span>
                      <Progress value={80} className="w-32 h-1.5 bg-gray-700" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-fuchsia-500/10 border border-fuchsia-500/20">
                <div className="flex items-start">
                  <ArrowRight className="w-5 h-5 text-fuchsia-400 mt-0.5 mr-2 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-fuchsia-400 mb-1">
                      Competitive Pricing Alert
                    </h4>
                    <p className="text-gray-300 text-sm">
                      {pricingRecs.competitivePriceProducts} products are priced
                      significantly higher than competitors. Adjust pricing to
                      remain competitive.
                    </p>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-xs text-gray-400">
                        Market Share Impact
                      </span>
                      <Progress value={70} className="w-32 h-1.5 bg-gray-700" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
                <div className="flex items-start">
                  <Lightbulb className="w-5 h-5 text-blue-400 mt-0.5 mr-2 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-blue-400 mb-1">
                      Dynamic Pricing Strategy
                    </h4>
                    <p className="text-gray-300 text-sm">
                      Implement dynamic pricing for{" "}
                      {pricingRecs.highElasticityProducts} high-elasticity
                      products based on demand patterns and competitor pricing.
                    </p>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-xs text-gray-400">
                        Profit Optimization
                      </span>
                      <Progress value={90} className="w-32 h-1.5 bg-gray-700" />
                    </div>
                  </div>
                </div>
              </div>

              <Button className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white">
                Generate Pricing Optimization Plan
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}
