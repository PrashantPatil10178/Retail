"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BarChart, DonutChart } from "@/components/ui/chart";
import {
  AlertTriangle,
  Package,
  Clock,
  CheckCircle,
  MapPin,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface InventoryMonitoringProps {
  inventoryData: any[];
  storeIds: string[];
}

export default function InventoryMonitoring({
  inventoryData,
  storeIds,
}: InventoryMonitoringProps) {
  // Calculate summary statistics
  const totalProducts = inventoryData.length;
  const avgStockLevel =
    inventoryData.length > 0
      ? Math.round(
          inventoryData.reduce(
            (sum, item) => sum + Number.parseInt(item["Stock Levels"] || "0"),
            0
          ) / totalProducts
        )
      : 0;
  const lowStockItems = inventoryData.filter(
    (item) =>
      Number.parseInt(item["Stock Levels"] || "0") <
      Number.parseInt(item["Reorder Point"] || "0")
  ).length;
  const stockoutRisk = inventoryData.filter(
    (item) => Number.parseInt(item["Stockout Frequency"] || "0") > 10
  ).length;

  // Prepare data for charts
  const stockLevelsByStore = storeIds.map((storeId) => {
    const storeItems = inventoryData.filter(
      (item) => item["Store ID"] === storeId
    );
    const avgStock =
      storeItems.length > 0
        ? Math.round(
            storeItems.reduce(
              (sum, item) => sum + Number.parseInt(item["Stock Levels"] || "0"),
              0
            ) / storeItems.length
          )
        : 0;
    return { name: `Store ${storeId}`, value: avgStock };
  });

  const stockoutFrequencyData = storeIds.map((storeId) => {
    const storeItems = inventoryData.filter(
      (item) => item["Store ID"] === storeId
    );
    const avgStockout =
      storeItems.length > 0
        ? Math.round(
            storeItems.reduce(
              (sum, item) =>
                sum + Number.parseInt(item["Stockout Frequency"] || "0"),
              0
            ) / storeItems.length
          )
        : 0;
    return { name: `Store ${storeId}`, value: avgStockout };
  });

  const leadTimeData = storeIds.map((storeId) => {
    const storeItems = inventoryData.filter(
      (item) => item["Store ID"] === storeId
    );
    const avgLeadTime =
      storeItems.length > 0
        ? Math.round(
            storeItems.reduce(
              (sum, item) =>
                sum + Number.parseInt(item["Supplier Lead Time (days)"] || "0"),
              0
            ) / storeItems.length
          )
        : 0;
    return { name: `Store ${storeId}`, value: avgLeadTime };
  });

  // Prepare data for inventory health
  const inventoryHealthData = [
    { name: "Optimal", value: 65 },
    { name: "Low Stock", value: 20 },
    { name: "Overstock", value: 10 },
    { name: "Critical", value: 5 },
  ];

  // Generate low stock alerts
  const generateLowStockAlerts = () => {
    return inventoryData
      .filter(
        (item) =>
          Number.parseInt(item["Stock Levels"] || "0") <
          Number.parseInt(item["Reorder Point"] || "0")
      )
      .slice(0, 5)
      .map((item) => ({
        productId: item["Product ID"],
        storeId: item["Store ID"],
        currentStock: Number.parseInt(item["Stock Levels"] || "0"),
        reorderPoint: Number.parseInt(item["Reorder Point"] || "0"),
        leadTime: Number.parseInt(item["Supplier Lead Time (days)"] || "0"),
      }));
  };

  const lowStockAlerts = generateLowStockAlerts();

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

  // Simulate real-time updates with a blinking effect
  const [blink, setBlink] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setBlink((prev) => !prev);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Inventory Status Summary */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {/* Total Products */}
        <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4 transition-all duration-300 hover:border-blue-500/30 hover:shadow-lg hover:shadow-blue-500/10">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Products</p>
              <h3 className="text-2xl font-bold text-white mt-1">
                {totalProducts}
              </h3>
            </div>
            <div className="p-2 rounded-lg bg-blue-500/20 text-blue-300">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-gray-400 text-xs mb-1">Inventory Coverage</p>
            <Progress
              value={85}
              className="h-1.5 bg-gray-700"
              style={
                {
                  "--progress-foreground": "hsl(var(--blue-500))",
                } as React.CSSProperties
              }
            />
          </div>
        </div>

        {/* Average Stock Level */}
        <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4 transition-all duration-300 hover:border-green-500/30 hover:shadow-lg hover:shadow-green-500/10">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-400 text-sm">Avg. Stock Level</p>
              <h3 className="text-2xl font-bold text-white mt-1">
                {avgStockLevel} units
              </h3>
            </div>
            <div className="p-2 rounded-lg bg-green-500/20 text-green-300">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-gray-400 text-xs mb-1">Target: 500 units</p>
            <Progress
              value={(avgStockLevel / 500) * 100}
              className="h-1.5 bg-gray-700"
              style={
                {
                  "--progress-foreground": "hsl(var(--green-500))",
                } as React.CSSProperties
              }
            />
          </div>
        </div>

        {/* Low Stock Items */}
        <div
          className={`bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-sm border ${
            blink ? "border-amber-500/50" : "border-gray-700/50"
          } rounded-xl p-4 transition-all duration-300 hover:border-amber-500/30 hover:shadow-lg hover:shadow-amber-500/10`}
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-400 text-sm">Low Stock Items</p>
              <h3 className="text-2xl font-bold text-white mt-1">
                {lowStockItems}
              </h3>
            </div>
            <div
              className={`p-2 rounded-lg ${
                blink ? "bg-amber-500/30" : "bg-amber-500/20"
              } text-amber-300`}
            >
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-gray-400 text-xs mb-1">
              {lowStockItems > 0
                ? `${Math.round(
                    (lowStockItems / totalProducts) * 100
                  )}% of inventory`
                : "No low stock items"}
            </p>
            <Progress
              value={(lowStockItems / totalProducts) * 100}
              className="h-1.5 bg-gray-700"
              style={
                {
                  "--progress-foreground": "hsl(var(--amber-500))",
                } as React.CSSProperties
              }
            />
          </div>
        </div>

        {/* Stockout Risk */}
        <div
          className={`bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-sm border ${
            blink ? "border-red-500/50" : "border-gray-700/50"
          } rounded-xl p-4 transition-all duration-300 hover:border-red-500/30 hover:shadow-lg hover:shadow-red-500/10`}
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-400 text-sm">Stockout Risk</p>
              <h3 className="text-2xl font-bold text-white mt-1">
                {stockoutRisk}
              </h3>
            </div>
            <div
              className={`p-2 rounded-lg ${
                blink ? "bg-red-500/30" : "bg-red-500/20"
              } text-red-300`}
            >
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-gray-400 text-xs mb-1">
              {stockoutRisk > 0
                ? `${Math.round(
                    (stockoutRisk / totalProducts) * 100
                  )}% of products`
                : "No stockout risk"}
            </p>
            <Progress
              value={(stockoutRisk / totalProducts) * 100}
              className="h-1.5 bg-gray-700"
              style={
                {
                  "--progress-foreground": "hsl(var(--red-500))",
                } as React.CSSProperties
              }
            />
          </div>
        </div>
      </motion.div>

      {/* Main Inventory Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Stock Levels by Store */}
        <motion.div variants={itemVariants}>
          <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700/50 rounded-xl">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Package className="w-5 h-5 mr-2 text-purple-400" />
                Stock Levels by Store
              </CardTitle>
              <CardDescription>
                Average stock levels across all store locations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <BarChart
                  data={stockLevelsByStore}
                  index="name"
                  categories={["value"]}
                  colors={["#a855f7"]}
                  valueFormatter={(value) => `${value} units`}
                  yAxisWidth={60}
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Stockout Frequency Analysis */}
        <motion.div variants={itemVariants}>
          <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700/50 rounded-xl">
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2 text-amber-400" />
                Stockout Frequency Analysis
              </CardTitle>
              <CardDescription>
                Number of stockout incidents per store
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <BarChart
                  data={stockoutFrequencyData}
                  index="name"
                  categories={["value"]}
                  colors={["#f59e0b"]}
                  valueFormatter={(value) => `${value} incidents`}
                  yAxisWidth={60}
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Inventory Map and Health */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Inventory Distribution Map */}
        <motion.div variants={itemVariants}>
          <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700/50 rounded-xl">
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="w-5 h-5 mr-2 text-blue-400" />
                Inventory Distribution Map
              </CardTitle>
              <CardDescription>
                Geographic distribution of inventory across stores
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] relative bg-gray-800/50 rounded-lg overflow-hidden">
                {/* Simplified map visualization */}
                <div className="absolute inset-0 grid-pattern opacity-20"></div>

                {/* Store locations */}
                {storeIds.map((storeId, index) => {
                  // Generate random positions for demo
                  const x = 50 + Math.sin(index * 0.7) * 40;
                  const y = 50 + Math.cos(index * 0.7) * 40;

                  // Calculate size based on inventory level
                  const storeItems = inventoryData.filter(
                    (item) => item["Store ID"] === storeId
                  );
                  const avgStock =
                    storeItems.length > 0
                      ? Math.round(
                          storeItems.reduce(
                            (sum, item) =>
                              sum +
                              Number.parseInt(item["Stock Levels"] || "0"),
                            0
                          ) / storeItems.length
                        )
                      : 0;

                  const size = 10 + avgStock / 100;
                  const opacity = 0.5 + avgStock / 1000;

                  return (
                    <div
                      key={storeId}
                      className="absolute rounded-full bg-blue-500 flex items-center justify-center text-xs font-bold text-white shadow-lg shadow-blue-500/20 cursor-pointer transition-all duration-300 hover:z-10 hover:scale-110"
                      style={{
                        left: `${x}%`,
                        top: `${y}%`,
                        width: `${size}px`,
                        height: `${size}px`,
                        opacity: opacity,
                        transform: "translate(-50%, -50%)",
                      }}
                    >
                      {size > 20 && storeId}
                    </div>
                  );
                })}

                {/* Legend */}
                <div className="absolute bottom-4 left-4 bg-gray-900/80 p-2 rounded-md text-xs">
                  <div className="flex items-center mb-1">
                    <div className="w-3 h-3 rounded-full bg-blue-500 opacity-80 mr-2"></div>
                    <span className="text-gray-300">High Stock</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-blue-500 opacity-30 mr-2"></div>
                    <span className="text-gray-300">Low Stock</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-2">
                {storeIds.slice(0, 6).map((storeId) => {
                  const storeItems = inventoryData.filter(
                    (item) => item["Store ID"] === storeId
                  );
                  const avgStock =
                    storeItems.length > 0
                      ? Math.round(
                          storeItems.reduce(
                            (sum, item) =>
                              sum +
                              Number.parseInt(item["Stock Levels"] || "0"),
                            0
                          ) / storeItems.length
                        )
                      : 0;

                  return (
                    <div
                      key={storeId}
                      className="flex items-center justify-between p-2 rounded-md bg-gray-800/50 border border-gray-700/50"
                    >
                      <span className="text-sm text-gray-300">
                        Store {storeId}
                      </span>
                      <Badge
                        variant="outline"
                        className={
                          avgStock < 300
                            ? "bg-amber-500/10 text-amber-300 border-amber-500/30"
                            : "bg-green-500/10 text-green-300 border-green-500/30"
                        }
                      >
                        {avgStock} units
                      </Badge>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Inventory Health Distribution */}
        <motion.div variants={itemVariants}>
          <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700/50 rounded-xl">
            <CardHeader>
              <CardTitle className="flex items-center">
                <CheckCircle className="w-5 h-5 mr-2 text-green-400" />
                Inventory Health Distribution
              </CardTitle>
              <CardDescription>
                Current status of inventory across all categories
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <DonutChart
                  data={inventoryHealthData}
                  index="name"
                  category="value"
                  valueFormatter={(value) => `${value}%`}
                  colors={["#22c55e", "#f59e0b", "#3b82f6", "#ef4444"]}
                  className="h-[300px]"
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Low Stock Alerts */}
      <motion.div variants={itemVariants}>
        <Card
          className={`bg-gradient-to-br from-gray-900 to-gray-800 border ${
            blink ? "border-amber-500/50" : "border-gray-700/50"
          } rounded-xl transition-colors duration-300`}
        >
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle
                className={`w-5 h-5 mr-2 ${
                  blink ? "text-amber-400 animate-pulse" : "text-amber-400"
                }`}
              />
              Low Stock Alerts
            </CardTitle>
            <CardDescription>
              Products that need immediate attention
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {lowStockAlerts.length > 0 ? (
                lowStockAlerts.map((alert, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg ${
                      blink && index === 0
                        ? "bg-amber-500/20"
                        : "bg-gray-800/50"
                    } border border-amber-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors duration-300`}
                  >
                    <div>
                      <div className="flex items-center">
                        <AlertTriangle
                          className={`w-4 h-4 mr-2 ${
                            blink && index === 0
                              ? "text-amber-400 animate-pulse"
                              : "text-amber-400"
                          }`}
                        />
                        <h4 className="font-medium text-white">
                          Product ID: {alert.productId}
                        </h4>
                      </div>
                      <p className="text-gray-300 text-sm mt-1">
                        Store {alert.storeId} | Current Stock:{" "}
                        <span className="text-amber-400 font-medium">
                          {alert.currentStock}
                        </span>{" "}
                        | Reorder Point: {alert.reorderPoint}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center text-gray-300 text-sm">
                        <Clock className="w-4 h-4 mr-1 text-blue-400" />
                        <span>Lead Time: {alert.leadTime} days</span>
                      </div>
                      <Button
                        size="sm"
                        className="bg-amber-500 hover:bg-amber-600 text-white"
                      >
                        Reorder Now
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 rounded-lg bg-gray-800/50 border border-gray-700/50 text-center">
                  <p className="text-gray-300">
                    No low stock alerts at this time.
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
