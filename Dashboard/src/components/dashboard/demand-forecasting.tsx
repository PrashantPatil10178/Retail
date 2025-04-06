"use client";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LineChart, BarChart } from "@/components/ui/chart";
import { TrendingUp, Calendar, Map, BarChart3, Package } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface DemandForecastingProps {
  inventoryData: any[];
  pricingData: any[];
  timeRange: string;
  productCategory: string;
}

export default function DemandForecasting({
  inventoryData,
  timeRange,
  productCategory,
}: DemandForecastingProps) {
  // Generate time series data based on the selected time range
  const generateTimeSeriesData = () => {
    const days = Number.parseInt(timeRange);
    const data = [];
    const today = new Date();

    for (let i = days; i >= 0; i--) {
      const date = new Date();
      date.setDate(today.getDate() - i);

      const baseValue = 500;
      const seasonalFactor = 1 + 0.2 * Math.sin((i / (days / 6)) * Math.PI);
      const trendFactor = 1 + (i / days) * 0.1;
      const randomFactor = 0.9 + Math.random() * 0.2;

      const actual = Math.round(
        baseValue * seasonalFactor * trendFactor * randomFactor
      );

      const forecastRandomFactor = 0.95 + Math.random() * 0.1;
      const forecast = Math.round(
        baseValue * seasonalFactor * trendFactor * forecastRandomFactor
      );

      data.push({
        date: date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        actual: i <= days - 7 ? actual : null,
        forecast: forecast,
        upperBound: Math.round(forecast * 1.1),
        lowerBound: Math.round(forecast * 0.9),
      });
    }

    return data;
  };

  // Generate seasonal demand data
  const generateSeasonalData = () => {
    return [
      { month: "Jan", value: 420 },
      { month: "Feb", value: 380 },
      { month: "Mar", value: 450 },
      { month: "Apr", value: 520 },
      { month: "May", value: 550 },
      { month: "Jun", value: 590 },
      { month: "Jul", value: 610 },
      { month: "Aug", value: 590 },
      { month: "Sep", value: 540 },
      { month: "Oct", value: 490 },
      { month: "Nov", value: 520 },
      { month: "Dec", value: 580 },
    ];
  };

  // Generate store demand heatmap data
  const generateStoreHeatmapData = () => {
    const storeData: Record<string, { total: number; count: number }> = {};

    inventoryData.forEach((item) => {
      const storeId = item["Store ID"];
      const stockLevel = Number.parseInt(item["Stock Levels"] || "0");

      if (!storeData[storeId]) {
        storeData[storeId] = { total: 0, count: 0 };
      }

      storeData[storeId].total += stockLevel;
      storeData[storeId].count += 1;
    });

    return Object.entries(storeData).map(([storeId, data]) => ({
      store: `Store ${storeId}`,
      demand: Math.round(data.total / data.count),
      growth: Math.round(Math.random() * 20 - 5),
    }));
  };

  // Generate forecast accuracy data
  const generateForecastAccuracyData = () => {
    return [
      { period: "Week 1", accuracy: 94 },
      { period: "Week 2", accuracy: 92 },
      { period: "Week 3", accuracy: 96 },
      { period: "Week 4", accuracy: 91 },
      { period: "Week 5", accuracy: 93 },
      { period: "Week 6", accuracy: 95 },
      { period: "Week 7", accuracy: 94 },
      { period: "Week 8", accuracy: 97 },
    ];
  };

  // New function for product-specific forecast
  const generateProductForecastData = () => {
    // Sample product data within the selected category
    const products = [
      { name: `${productCategory} A`, baseDemand: 200 },
      { name: `${productCategory} B`, baseDemand: 150 },
      { name: `${productCategory} C`, baseDemand: 100 },
      { name: `${productCategory} D`, baseDemand: 80 },
    ];

    return products.map((product) => {
      const trendFactor = 1 + Math.random() * 0.1;
      const seasonalFactor = 1 + Math.random() * 0.2;
      const randomFactor = 0.95 + Math.random() * 0.1;

      const forecast = Math.round(
        product.baseDemand * trendFactor * seasonalFactor * randomFactor
      );

      return {
        product: product.name,
        forecast,
        currentStock: Math.round(forecast * (0.8 + Math.random() * 0.3)),
        growth: Math.round(Math.random() * 15 - 5),
      };
    });
  };

  const timeSeriesData = generateTimeSeriesData();
  const seasonalData = generateSeasonalData();
  const storeHeatmapData = generateStoreHeatmapData();
  const forecastAccuracyData = generateForecastAccuracyData();
  const productForecastData = generateProductForecastData();

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
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Main Demand Forecast Chart */}
      <motion.div variants={itemVariants}>
        <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700/50 rounded-xl overflow-hidden">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-bold flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-purple-400" />
                  Demand Forecast vs. Actual
                </CardTitle>
                <CardDescription>
                  AI-powered demand prediction with confidence intervals
                </CardDescription>
              </div>
              <Badge
                variant="outline"
                className="bg-purple-500/10 text-purple-300 border-purple-500/30"
              >
                <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse mr-2"></span>
                Live Prediction
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[400px] relative">
              <LineChart
                data={timeSeriesData}
                index="date"
                categories={["actual", "forecast", "upperBound", "lowerBound"]}
                colors={[
                  "#a855f7",
                  "#3b82f6",
                  "rgba(59, 130, 246, 0.2)",
                  "rgba(59, 130, 246, 0.2)",
                ]}
                valueFormatter={(value) => `${value} units`}
                yAxisWidth={60}
              />
              <div className="absolute top-0 right-0 w-32 h-32 opacity-30 pointer-events-none"></div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Secondary Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Seasonal Demand Patterns */}
        <motion.div variants={itemVariants}>
          <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700/50 rounded-xl h-full">
            <CardHeader>
              <CardTitle className="text-lg font-bold flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-blue-400" />
                Seasonal Demand Patterns
              </CardTitle>
              <CardDescription>
                Monthly demand trends throughout the year
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <BarChart
                  data={seasonalData}
                  index="month"
                  categories={["value"]}
                  colors={["#3b82f6"]}
                  valueFormatter={(value) => `${value} units`}
                  yAxisWidth={60}
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Store Demand Heatmap */}
        <motion.div variants={itemVariants}>
          <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700/50 rounded-xl h-full">
            <CardHeader>
              <CardTitle className="text-lg font-bold flex items-center">
                <Map className="w-5 h-5 mr-2 text-fuchsia-400" />
                Store Demand Distribution
              </CardTitle>
              <CardDescription>
                Demand levels across different store locations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <BarChart
                  data={storeHeatmapData}
                  index="store"
                  categories={["demand"]}
                  colors={["#d946ef"]}
                  valueFormatter={(value) => `${value} units`}
                  yAxisWidth={60}
                />
              </div>
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-2">
                {storeHeatmapData.slice(0, 6).map((store, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 rounded-md bg-gray-800/50 border border-gray-700/50"
                  >
                    <span className="text-sm text-gray-300">{store.store}</span>
                    <div className="flex items-center">
                      <span
                        className={`text-sm ${
                          store.growth > 0 ? "text-green-400" : "text-red-400"
                        }`}
                      >
                        {store.growth > 0 ? "+" : ""}
                        {store.growth}%
                      </span>
                      {store.growth > 0 ? (
                        <TrendingUp className="w-3 h-3 ml-1 text-green-400" />
                      ) : (
                        <TrendingUp className="w-3 h-3 ml-1 text-red-400 transform rotate-180" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Product Forecast */}
        <motion.div variants={itemVariants}>
          <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700/50 rounded-xl h-full">
            <CardHeader>
              <CardTitle className="text-lg font-bold flex items-center">
                <Package className="w-5 h-5 mr-2 text-orange-400" />
                Product Forecast
              </CardTitle>
              <CardDescription>
                Demand forecast by product in {productCategory} category
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <BarChart
                  data={productForecastData}
                  index="product"
                  categories={["forecast", "currentStock"]}
                  colors={["#f97316", "#fb923c"]}
                  valueFormatter={(value) => `${value} units`}
                  yAxisWidth={60}
                />
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2">
                {productForecastData.map((product, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 rounded-md bg-gray-800/50 border border-gray-700/50"
                  >
                    <span className="text-sm text-gray-300">
                      {product.product}
                    </span>
                    <div className="flex items-center">
                      <span
                        className={`text-sm ${
                          product.growth > 0 ? "text-green-400" : "text-red-400"
                        }`}
                      >
                        {product.growth > 0 ? "+" : ""}
                        {product.growth}%
                      </span>
                      {product.growth > 0 ? (
                        <TrendingUp className="w-3 h-3 ml-1 text-green-400" />
                      ) : (
                        <TrendingUp className="w-3 h-3 ml-1 text-red-400 transform rotate-180" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Forecast Accuracy */}
        <motion.div variants={itemVariants}>
          <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700/50 rounded-xl h-full">
            <CardHeader>
              <CardTitle className="text-lg font-bold flex items-center">
                <BarChart3 className="w-5 h-5 mr-2 text-green-400" />
                Forecast Accuracy
              </CardTitle>
              <CardDescription>
                Historical accuracy of AI demand predictions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[250px]">
                <LineChart
                  data={forecastAccuracyData}
                  index="period"
                  categories={["accuracy"]}
                  colors={["#22c55e"]}
                  valueFormatter={(value) => `${value}%`}
                  yAxisWidth={60}
                />
              </div>
              <div className="mt-4 p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                <h4 className="font-medium text-green-400 mb-1">
                  AI Forecast Insight
                </h4>
                <p className="text-gray-300 text-sm">
                  Our AI model has maintained a 94.7% average accuracy over the
                  past 8 weeks, with continuous improvements through machine
                  learning.
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}
