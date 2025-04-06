"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LineChart, PieChart } from "@/components/ui/chart";
import {
  DollarSign,
  TrendingUp,
  BarChart3,
  ArrowRight,
  Sliders,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface PricingOptimizationProps {
  pricingData: any[];
  productCategory: string;
}

export default function PricingOptimization({
  pricingData,
}: PricingOptimizationProps) {
  const [priceChangePercentage, setPriceChangePercentage] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [simulationResults, setSimulationResults] = useState<any>(null);

  // Prepare data for pricing strategy distribution
  const pricingStrategyData = [
    { name: "Standard", value: 45 },
    { name: "Discounted", value: 30 },
    { name: "Clearance", value: 15 },
    { name: "Premium", value: 10 },
  ];

  // Prepare data for price elasticity analysis
  const priceElasticityData = [
    { name: "-20%", sales: 140, profit: 70 },
    { name: "-15%", sales: 125, profit: 75 },
    { name: "-10%", sales: 115, profit: 80 },
    { name: "-5%", sales: 105, profit: 90 },
    { name: "0%", sales: 100, profit: 100 },
    { name: "+5%", sales: 90, profit: 95 },
    { name: "+10%", sales: 80, profit: 88 },
    { name: "+15%", sales: 70, profit: 80 },
    { name: "+20%", sales: 60, profit: 72 },
  ];

  // Prepare data for price trends
  const generatePriceTrendData = () => {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    return months.map((month) => {
      // Generate some realistic price trends with randomness
      const basePrice = 50;
      const seasonalFactor =
        1 + 0.1 * Math.sin((months.indexOf(month) / 6) * Math.PI);
      const randomFactor = 0.95 + Math.random() * 0.1;

      return {
        month,
        price:
          Math.round(basePrice * seasonalFactor * randomFactor * 100) / 100,
        competitorPrice:
          Math.round(basePrice * seasonalFactor * randomFactor * 0.95 * 100) /
          100,
      };
    });
  };

  const priceTrendData = generatePriceTrendData();

  // Prepare product pricing table data
  const prepareProductPricingData = () => {
    // Take a sample of the pricing data for the table
    return pricingData.slice(0, 10).map((item) => {
      const price = Number.parseFloat(item["Price"] || "0");
      const salesVolume = Number.parseInt(item["Sales Volume"] || "0");
      const elasticity = Number.parseFloat(item["Elasticity Index"] || "1");
      const competitorPrice = Number.parseFloat(
        item["Competitor Prices"] || "0"
      );
      const returnRate = Number.parseFloat(item["Return Rate (%)"] || "0");
      const storageCost = Number.parseFloat(item["Storage Cost"] || "0");

      // Calculate recommended price based on elasticity, competitor price, and other factors
      let recommendedPrice = price;
      let recommendationReason = "";

      if (elasticity > 1.5) {
        // Highly elastic - very price sensitive
        recommendedPrice = Math.min(price * 0.95, competitorPrice * 0.97);
        recommendationReason = "Highly price sensitive (elasticity > 1.5)";
      } else if (elasticity > 1.2) {
        // Elastic - price sensitive
        recommendedPrice = Math.min(price * 0.97, competitorPrice * 0.98);
        recommendationReason = "Price sensitive (elasticity 1.2-1.5)";
      } else if (elasticity < 0.8) {
        // Inelastic - not price sensitive
        recommendedPrice = price * 1.1;
        recommendationReason = "Low price sensitivity (elasticity < 0.8)";
      } else if (competitorPrice > price * 1.1) {
        // Competitor is significantly higher
        recommendedPrice = Math.min(price * 1.08, competitorPrice * 0.95);
        recommendationReason = "Competitor price significantly higher";
      } else if (returnRate > 15) {
        // High return rate - consider lowering price
        recommendedPrice = price * 0.95;
        recommendationReason = "High return rate (>15%)";
      } else if (storageCost > price * 0.2) {
        // High storage cost - consider discount to move inventory
        recommendedPrice = price * 0.9;
        recommendationReason = "High storage cost (>20% of price)";
      } else {
        // Default - match competitor with slight discount
        recommendedPrice = competitorPrice * 0.98;
        recommendationReason = "Match competitor with slight discount";
      }

      // Ensure recommended price is reasonable (not below cost)
      const minPrice = price * 0.7; // Assume minimum 30% margin
      recommendedPrice = Math.max(recommendedPrice, minPrice);

      // Calculate profit margin
      const costPrice = price * 0.7; // Assume cost is 70% of price
      const currentMargin = ((price - costPrice) / price) * 100;
      const recommendedMargin =
        ((recommendedPrice - costPrice) / recommendedPrice) * 100;

      return {
        productId: item["Product ID"],
        storeId: item["Store ID"],
        currentPrice: price.toFixed(2),
        recommendedPrice: recommendedPrice.toFixed(2),
        competitorPrice: competitorPrice.toFixed(2),
        salesVolume,
        elasticity: elasticity.toFixed(2),
        currentMargin: currentMargin.toFixed(1),
        recommendedMargin: recommendedMargin.toFixed(1),
        priceChange: (((recommendedPrice - price) / price) * 100).toFixed(1),
        recommendationReason,
        returnRate: returnRate.toFixed(1),
        storageCost: storageCost.toFixed(2),
      };
    });
  };

  const productPricingData = prepareProductPricingData();

  // Handle price simulation with more accurate calculations
  const simulatePriceChange = () => {
    if (!selectedProduct) return;

    const product = productPricingData.find(
      (p) => p.productId === selectedProduct
    );
    if (!product) return;

    const currentPrice = Number.parseFloat(product.currentPrice);
    const newPrice = currentPrice * (1 + priceChangePercentage / 100);
    const elasticity = Number.parseFloat(product.elasticity);
    const currentVolume = product.salesVolume;

    // More sophisticated volume change calculation
    let volumeChangePercentage = -elasticity * priceChangePercentage;

    // Adjust for extreme cases (don't allow more than 80% drop or 200% increase)
    volumeChangePercentage = Math.max(
      -80,
      Math.min(200, volumeChangePercentage)
    );

    const newVolume = Math.max(
      1,
      currentVolume * (1 + volumeChangePercentage / 100)
    );

    // Calculate revenue and profit with storage cost consideration
    const costPrice = currentPrice * 0.7; // Assume cost is 70% of price
    const storageCost = Number.parseFloat(product.storageCost);

    // Current metrics
    const currentRevenue = currentPrice * currentVolume;
    const currentCost = costPrice * currentVolume;
    const currentStorageCost = (storageCost * currentVolume) / 30; // Daily storage cost
    const currentProfit = currentRevenue - currentCost - currentStorageCost;

    // New metrics
    const newRevenue = newPrice * newVolume;
    const newCost = costPrice * newVolume;
    const newStorageCost = (storageCost * newVolume) / 30; // Daily storage cost
    const newProfit = newRevenue - newCost - newStorageCost;

    // Calculate percentage changes
    const revenueChange =
      ((newRevenue - currentRevenue) / currentRevenue) * 100;
    const profitChange = ((newProfit - currentProfit) / currentProfit) * 100;

    // Determine if the change is recommended
    let recommendation = "";
    if (profitChange > 5) {
      recommendation = "Strongly recommended (profit increase >5%)";
    } else if (profitChange > 0) {
      recommendation = "Recommended (small profit increase)";
    } else if (profitChange > -2) {
      recommendation = "Neutral (minimal profit impact)";
    } else if (profitChange > -5) {
      recommendation = "Caution advised (moderate profit decrease)";
    } else {
      recommendation = "Not recommended (significant profit decrease)";
    }

    setSimulationResults({
      productId: product.productId,
      currentPrice: currentPrice.toFixed(2),
      newPrice: newPrice.toFixed(2),
      priceChange: priceChangePercentage.toFixed(1),
      currentVolume: currentVolume,
      newVolume: Math.round(newVolume),
      volumeChange: volumeChangePercentage.toFixed(1),
      currentRevenue: currentRevenue.toFixed(2),
      newRevenue: newRevenue.toFixed(2),
      revenueChange: revenueChange.toFixed(1),
      currentProfit: currentProfit.toFixed(2),
      newProfit: newProfit.toFixed(2),
      profitChange: profitChange.toFixed(1),
      elasticity: elasticity.toFixed(2),
      recommendation,
      recommendationReason: product.recommendationReason,
      currentMargin: product.currentMargin,
      newMargin: (((newPrice - costPrice) / newPrice) * 100).toFixed(1),
    });
  };

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
      {/* Main Pricing Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Price Trends */}
        <motion.div variants={itemVariants}>
          <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700/50 rounded-xl">
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-purple-400" />
                Price Trends Over Time
              </CardTitle>
              <CardDescription>
                Historical price changes compared to competitors
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <LineChart
                  data={priceTrendData}
                  index="month"
                  categories={["price", "competitorPrice"]}
                  colors={["#a855f7", "#3b82f6"]}
                  valueFormatter={(value) => `$${value}`}
                  yAxisWidth={60}
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Price Elasticity Analysis */}
        <motion.div variants={itemVariants}>
          <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700/50 rounded-xl">
            <CardHeader>
              <CardTitle className="flex items-center">
                <DollarSign className="w-5 h-5 mr-2 text-green-400" />
                Price Elasticity Analysis
              </CardTitle>
              <CardDescription>
                Impact of price changes on sales volume and profit
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <LineChart
                  data={priceElasticityData}
                  index="name"
                  categories={["sales", "profit"]}
                  colors={["#22c55e", "#f59e0b"]}
                  valueFormatter={(value) => `${value}%`}
                  yAxisWidth={60}
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Pricing Strategy and What-If Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Current Pricing Strategy */}
        <motion.div variants={itemVariants}>
          <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700/50 rounded-xl">
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="w-5 h-5 mr-2 text-purple-400" />
                Current Pricing Strategy
              </CardTitle>
              <CardDescription>
                Distribution of products by pricing category
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <PieChart
                  data={pricingStrategyData}
                  index="name"
                  category="value"
                  valueFormatter={(value) => `${value}%`}
                  colors={["#a855f7", "#3b82f6", "#f59e0b", "#ef4444"]}
                  className="h-[300px]"
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* What-If Analysis Tool */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700/50 rounded-xl">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Sliders className="w-5 h-5 mr-2 text-blue-400" />
                Advanced Price Simulation Tool
              </CardTitle>
              <CardDescription>
                Analyze the impact of price changes using real elasticity data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-400 mb-2 block">
                      Select Product
                    </label>
                    <select
                      className="w-full bg-gray-800 border border-gray-700 rounded-md p-2 text-white"
                      value={selectedProduct || ""}
                      onChange={(e) => setSelectedProduct(e.target.value)}
                    >
                      <option value="">Select a product</option>
                      {productPricingData.map((product) => (
                        <option
                          key={product.productId}
                          value={product.productId}
                        >
                          Product {product.productId} (${product.currentPrice})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-sm text-gray-400 mb-2 block">
                      Price Change: {priceChangePercentage > 0 ? "+" : ""}
                      {priceChangePercentage}%
                    </label>
                    <div className="pt-2">
                      <Slider
                        value={[priceChangePercentage]}
                        min={-30}
                        max={30}
                        step={1}
                        onValueChange={(value) =>
                          setPriceChangePercentage(value[0])
                        }
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={simulatePriceChange}
                    disabled={!selectedProduct}
                  >
                    Run Simulation
                  </Button>
                </div>

                {simulationResults && (
                  <div className="mt-4 p-4 rounded-lg bg-gray-800/50 border border-gray-700/50">
                    <h4 className="font-medium text-white mb-3">
                      Simulation Results for Product{" "}
                      {simulationResults.productId}
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="p-3 rounded-md bg-gray-900/50 border border-gray-700/50">
                        <p className="text-xs text-gray-400 mb-1">Price</p>
                        <div className="flex items-baseline justify-between">
                          <p className="text-sm text-gray-300">
                            ${simulationResults.currentPrice}{" "}
                            <ArrowRight className="inline w-3 h-3" /> $
                            {simulationResults.newPrice}
                          </p>
                          <Badge
                            className={
                              Number.parseFloat(
                                simulationResults.priceChange
                              ) >= 0
                                ? "bg-green-500/20 text-green-300"
                                : "bg-red-500/20 text-red-300"
                            }
                          >
                            {simulationResults.priceChange}%
                          </Badge>
                        </div>
                      </div>

                      <div className="p-3 rounded-md bg-gray-900/50 border border-gray-700/50">
                        <p className="text-xs text-gray-400 mb-1">
                          Sales Volume
                        </p>
                        <div className="flex items-baseline justify-between">
                          <p className="text-sm text-gray-300">
                            {simulationResults.currentVolume}{" "}
                            <ArrowRight className="inline w-3 h-3" />{" "}
                            {simulationResults.newVolume}
                          </p>
                          <Badge
                            className={
                              Number.parseFloat(
                                simulationResults.volumeChange
                              ) >= 0
                                ? "bg-green-500/20 text-green-300"
                                : "bg-red-500/20 text-red-300"
                            }
                          >
                            {simulationResults.volumeChange}%
                          </Badge>
                        </div>
                      </div>

                      <div className="p-3 rounded-md bg-gray-900/50 border border-gray-700/50">
                        <p className="text-xs text-gray-400 mb-1">Elasticity</p>
                        <div className="flex items-baseline justify-between">
                          <p className="text-sm text-gray-300">
                            {simulationResults.elasticity}
                          </p>
                          <Badge
                            className={
                              Number.parseFloat(simulationResults.elasticity) >
                              1.2
                                ? "bg-purple-500/20 text-purple-300"
                                : Number.parseFloat(
                                    simulationResults.elasticity
                                  ) < 0.8
                                ? "bg-amber-500/20 text-amber-300"
                                : "bg-blue-500/20 text-blue-300"
                            }
                          >
                            {Number.parseFloat(simulationResults.elasticity) >
                            1.2
                              ? "Elastic"
                              : Number.parseFloat(
                                  simulationResults.elasticity
                                ) < 0.8
                              ? "Inelastic"
                              : "Neutral"}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="p-3 rounded-md bg-gray-900/50 border border-gray-700/50">
                        <p className="text-xs text-gray-400 mb-1">Revenue</p>
                        <div className="flex items-baseline justify-between">
                          <p className="text-sm text-gray-300">
                            ${simulationResults.currentRevenue}{" "}
                            <ArrowRight className="inline w-3 h-3" /> $
                            {simulationResults.newRevenue}
                          </p>
                          <Badge
                            className={
                              Number.parseFloat(
                                simulationResults.revenueChange
                              ) >= 0
                                ? "bg-green-500/20 text-green-300"
                                : "bg-red-500/20 text-red-300"
                            }
                          >
                            {simulationResults.revenueChange}%
                          </Badge>
                        </div>
                      </div>

                      <div className="p-3 rounded-md bg-gray-900/50 border border-gray-700/50">
                        <p className="text-xs text-gray-400 mb-1">
                          Profit Margin
                        </p>
                        <div className="flex items-baseline justify-between">
                          <p className="text-sm text-gray-300">
                            {simulationResults.currentMargin}%{" "}
                            <ArrowRight className="inline w-3 h-3" />{" "}
                            {simulationResults.newMargin}%
                          </p>
                          <Badge
                            className={
                              Number.parseFloat(simulationResults.newMargin) >
                              Number.parseFloat(simulationResults.currentMargin)
                                ? "bg-green-500/20 text-green-300"
                                : "bg-red-500/20 text-red-300"
                            }
                          >
                            {(
                              Number.parseFloat(simulationResults.newMargin) -
                              Number.parseFloat(simulationResults.currentMargin)
                            ).toFixed(1)}
                            %
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <div className="p-3 rounded-md bg-blue-500/10 border border-blue-500/20">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs text-gray-400 mb-1">
                            Profit Impact
                          </p>
                          <p className="text-sm text-gray-300">
                            ${simulationResults.currentProfit}{" "}
                            <ArrowRight className="inline w-3 h-3" /> $
                            {simulationResults.newProfit}
                          </p>
                        </div>
                        <Badge
                          className={
                            Number.parseFloat(simulationResults.profitChange) >=
                            0
                              ? "bg-green-500/20 text-green-300 text-lg"
                              : "bg-red-500/20 text-red-300 text-lg"
                          }
                        >
                          {simulationResults.profitChange}%
                        </Badge>
                      </div>
                    </div>

                    <div className="mt-4 p-3 rounded-md bg-gray-900/50 border border-gray-700/50">
                      <p className="text-xs text-gray-400 mb-1">
                        Recommendation
                      </p>
                      <p className="text-sm font-medium text-white">
                        {simulationResults.recommendation}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {simulationResults.recommendationReason}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Product Pricing Table */}
      <motion.div variants={itemVariants}>
        <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700/50 rounded-xl">
          <CardHeader>
            <CardTitle className="flex items-center">
              <DollarSign className="w-5 h-5 mr-2 text-amber-400" />
              AI-Recommended Pricing
            </CardTitle>
            <CardDescription>
              Optimized pricing recommendations based on elasticity, competitor
              analysis, and inventory factors
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product ID</TableHead>
                    <TableHead>Store</TableHead>
                    <TableHead>Current Price</TableHead>
                    <TableHead>Recommended</TableHead>
                    <TableHead>Competitor</TableHead>
                    <TableHead>Change</TableHead>
                    <TableHead>Elasticity</TableHead>
                    <TableHead>Current Margin</TableHead>
                    <TableHead>New Margin</TableHead>
                    <TableHead>Reason</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {productPricingData.map((product) => (
                    <TableRow key={product.productId}>
                      <TableCell className="font-medium">
                        {product.productId}
                      </TableCell>
                      <TableCell>{product.storeId}</TableCell>
                      <TableCell>${product.currentPrice}</TableCell>
                      <TableCell className="font-medium text-amber-400">
                        ${product.recommendedPrice}
                      </TableCell>
                      <TableCell>${product.competitorPrice}</TableCell>
                      <TableCell>
                        <Badge
                          className={
                            Number.parseFloat(product.priceChange) >= 0
                              ? "bg-green-500/20 text-green-300"
                              : "bg-red-500/20 text-red-300"
                          }
                        >
                          {product.priceChange}%
                        </Badge>
                      </TableCell>
                      <TableCell>{product.elasticity}</TableCell>
                      <TableCell>{product.currentMargin}%</TableCell>
                      <TableCell className="font-medium">
                        {product.recommendedMargin}%
                      </TableCell>
                      <TableCell className="text-xs text-gray-400 max-w-[200px] truncate">
                        {product.recommendationReason}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
