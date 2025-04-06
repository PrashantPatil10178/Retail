"use client";
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DemandForecasting from "@/components/dashboard/demand-forecasting";
import InventoryMonitoring from "@/components/dashboard/inventory-monitoring";
import PricingOptimization from "@/components/dashboard/pricing-optimization";
import KeyMetrics from "@/components/dashboard/key-metrics";
import Recommendations from "@/components/dashboard/recommendations";
import { RefreshCw, Plus } from "lucide-react";
import { toast, Toaster } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface InventoryItem {
  "Product ID": string;
  "Store ID": string;
  "Stock Levels": string;
  "Supplier Lead Time (days)": string;
  "Stockout Frequency": string;
  "Reorder Point": string;
  "Expiry Date": string;
  "Warehouse Capacity": string;
  "Order Fulfillment Time (days)": string;
}

interface PricingItem {
  "Product ID": string;
  "Store ID": string;
  Price: string;
  "Competitor Prices": string;
  Discounts: string;
  "Sales Volume": string;
  "Customer Reviews": string;
  "Return Rate (%)": string;
  "Storage Cost": string;
  "Elasticity Index": string;
}

export default function DashboardPage() {
  const [inventoryData, setInventoryData] = useState<InventoryItem[]>([]);
  const [pricingData, setPricingData] = useState<PricingItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedStore, setSelectedStore] = useState<string>("all");
  const [timeRange, setTimeRange] = useState<string>("30");
  const [productCategory, setProductCategory] = useState<string>("all");
  const [isProjectDialogOpen, setIsProjectDialogOpen] = useState(false);
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
  const [newProject, setNewProject] = useState({
    name: "",
    description: "",
    startDate: "",
    endDate: "",
    budget: "",
  });
  const [newProduct, setNewProduct] = useState({
    product_id: "",
    date: "",
    store_id: "",
    sales_quantity: "",
    price: "",
    promotions: "No",
    seasonality_factors: "",
    external_factors: "",
    demand_trend: "",
    customer_segments: "",
  });

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch inventory data
        const inventoryResponse = await fetch(
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/inventory_monitoring-iqw5hI9K4CLLHzTZRWguZtgGxw2zAs.csv"
        );
        const inventoryText = await inventoryResponse.text();

        // Parse inventory CSV
        const inventoryLines = inventoryText.split("\n");
        const inventoryHeaders = inventoryLines[0].split(",");

        const parsedInventoryData = inventoryLines
          .slice(1)
          .map((line) => {
            if (!line.trim()) return null; // Skip empty lines

            const values = line.split(",");
            const item: any = {};

            inventoryHeaders.forEach((header, index) => {
              item[header.trim()] = values[index]?.trim() || "";
            });

            return item as InventoryItem;
          })
          .filter(Boolean) as InventoryItem[];

        setInventoryData(parsedInventoryData);

        // Fetch pricing data
        const pricingResponse = await fetch(
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/pricing_optimization-hzvtxU2e7jAv1JKVvv9wQhxVisENUf.csv"
        );
        const pricingText = await pricingResponse.text();

        // Parse pricing CSV
        const pricingLines = pricingText.split("\n");
        const pricingHeaders = pricingLines[0].split(",");

        const parsedPricingData = pricingLines
          .slice(1)
          .map((line) => {
            if (!line.trim()) return null; // Skip empty lines

            const values = line.split(",");
            const item: any = {};

            pricingHeaders.forEach((header, index) => {
              item[header.trim()] = values[index]?.trim() || "";
            });

            return item as PricingItem;
          })
          .filter(Boolean) as PricingItem[];

        setPricingData(parsedPricingData);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Get unique store IDs for the filter
  const storeIds = [
    ...new Set([
      ...inventoryData.map((item) => item["Store ID"]),
      ...pricingData.map((item) => item["Store ID"]),
    ]),
  ].sort();

  // Define product categories (for demo purposes)
  const productCategories = [
    "Electronics",
    "Clothing",
    "Home Goods",
    "Groceries",
    "Beauty",
    "Sports",
  ];

  // Filter data based on selected store
  const filteredInventoryData =
    selectedStore === "all"
      ? inventoryData
      : inventoryData.filter((item) => item["Store ID"] === selectedStore);

  const filteredPricingData =
    selectedStore === "all"
      ? pricingData
      : pricingData.filter((item) => item["Store ID"] === selectedStore);

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

  const handleAddProject = () => {
    // Here you would typically send the data to your backend
    console.log("Adding new project:", newProject);
    toast.success("Project Data Added");
    // Reset form
    setNewProject({
      name: "",
      description: "",
      startDate: "",
      endDate: "",
      budget: "",
    });
    setIsProjectDialogOpen(false);
  };

  const handleAddProduct = () => {
    console.log("Adding new product:", newProduct);
    toast.success("Product Data Added");
    // Reset form
    setNewProduct({
      product_id: "",
      date: "",
      store_id: "",
      sales_quantity: "",
      price: "",
      promotions: "No",
      seasonality_factors: "",
      external_factors: "",
      demand_trend: "",
      customer_segments: "",
    });
    setIsProductDialogOpen(false);
  };

  return (
    <div ref={containerRef} className="min-h-screen bg-[#0a0a0f] text-white">
      <Toaster richColors />
      {/* Background effects */}
      <div className="fixed inset-0 z-0 opacity-20">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-fuchsia-900/20" />
        <div className="absolute inset-0 grid-pattern opacity-30"></div>
      </div>

      <div className="relative z-10 pt-20">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-fuchsia-500 mb-4">
              Retail Intelligence Dashboard
            </h1>
            <p className="text-gray-300 text-lg max-w-3xl mx-auto">
              AI-powered insights for optimizing inventory, forecasting demand,
              and maximizing pricing strategies
            </p>
          </motion.div>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <RefreshCw className="w-16 h-16 text-purple-500 animate-spin mb-6" />
              <p className="text-gray-300 text-xl">Loading dashboard data...</p>
            </div>
          ) : (
            <>
              {/* Dashboard Controls */}
              <motion.div
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8 bg-gray-900/50 backdrop-blur-sm rounded-xl p-4 border border-gray-800 sticky top-20 z-30"
              >
                <div className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className="bg-purple-500/10 text-purple-300 border-purple-500/30 px-3 py-1"
                  >
                    <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse mr-2"></span>
                    Live Data
                  </Badge>
                  <p className="text-gray-400 text-sm">
                    Last updated: {new Date().toLocaleTimeString()}
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Select
                    value={selectedStore}
                    onValueChange={setSelectedStore}
                  >
                    <SelectTrigger className="w-[180px] bg-gray-800 border-gray-700">
                      <SelectValue placeholder="Select Store" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      <SelectItem value="all">All Stores</SelectItem>
                      {storeIds.map((id) => (
                        <SelectItem key={id} value={id}>
                          Store {id}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select
                    value={productCategory}
                    onValueChange={setProductCategory}
                  >
                    <SelectTrigger className="w-[180px] bg-gray-800 border-gray-700">
                      <SelectValue placeholder="Product Category" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      <SelectItem value="all">All Categories</SelectItem>
                      {productCategories.map((category) => (
                        <SelectItem
                          key={category}
                          value={category.toLowerCase()}
                        >
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={timeRange} onValueChange={setTimeRange}>
                    <SelectTrigger className="w-[180px] bg-gray-800 border-gray-700">
                      <SelectValue placeholder="Time Range" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      <SelectItem value="7">Last 7 Days</SelectItem>
                      <SelectItem value="30">Last 30 Days</SelectItem>
                      <SelectItem value="90">Last 90 Days</SelectItem>
                      <SelectItem value="365">Last Year</SelectItem>
                    </SelectContent>
                  </Select>

                  <Button
                    variant="outline"
                    className="border-purple-500/30 text-purple-300 hover:bg-purple-500/10"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Refresh
                  </Button>

                  <Dialog
                    open={isProjectDialogOpen}
                    onOpenChange={setIsProjectDialogOpen}
                  >
                    <DialogTrigger asChild>
                      <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Project
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[600px] bg-gray-800 border-gray-700">
                      <DialogHeader>
                        <DialogTitle className="text-purple-400">
                          Add New Project
                        </DialogTitle>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label
                            htmlFor="name"
                            className="text-right text-gray-300"
                          >
                            Project Name
                          </Label>
                          <Input
                            id="name"
                            value={newProject.name}
                            onChange={(e) =>
                              setNewProject({
                                ...newProject,
                                name: e.target.value,
                              })
                            }
                            className="col-span-3 bg-gray-700 border-gray-600 text-white"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label
                            htmlFor="description"
                            className="text-right text-gray-300"
                          >
                            Description
                          </Label>
                          <Textarea
                            id="description"
                            value={newProject.description}
                            onChange={(e) =>
                              setNewProject({
                                ...newProject,
                                description: e.target.value,
                              })
                            }
                            className="col-span-3 bg-gray-700 border-gray-600 text-white"
                            rows={3}
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label
                            htmlFor="startDate"
                            className="text-right text-gray-300"
                          >
                            Start Date
                          </Label>
                          <Input
                            id="startDate"
                            type="date"
                            value={newProject.startDate}
                            onChange={(e) =>
                              setNewProject({
                                ...newProject,
                                startDate: e.target.value,
                              })
                            }
                            className="col-span-3 bg-gray-700 border-gray-600 text-white"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label
                            htmlFor="endDate"
                            className="text-right text-gray-300"
                          >
                            End Date
                          </Label>
                          <Input
                            id="endDate"
                            type="date"
                            value={newProject.endDate}
                            onChange={(e) =>
                              setNewProject({
                                ...newProject,
                                endDate: e.target.value,
                              })
                            }
                            className="col-span-3 bg-gray-700 border-gray-600 text-white"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label
                            htmlFor="budget"
                            className="text-right text-gray-300"
                          >
                            Budget ($)
                          </Label>
                          <Input
                            id="budget"
                            type="number"
                            value={newProject.budget}
                            onChange={(e) =>
                              setNewProject({
                                ...newProject,
                                budget: e.target.value,
                              })
                            }
                            className="col-span-3 bg-gray-700 border-gray-600 text-white"
                          />
                        </div>
                        <div className="flex justify-end gap-2 mt-4">
                          <Button
                            variant="outline"
                            onClick={() => setIsProjectDialogOpen(false)}
                            className="text-gray-300 border-gray-600 hover:bg-gray-700"
                          >
                            Cancel
                          </Button>
                          <Button
                            onClick={handleAddProject}
                            className="bg-purple-600 hover:bg-purple-700"
                          >
                            Add Project
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>

                  <Dialog
                    open={isProductDialogOpen}
                    onOpenChange={setIsProductDialogOpen}
                  >
                    <DialogTrigger asChild>
                      <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Product Data
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[600px] bg-gray-800 border-gray-700">
                      <DialogHeader>
                        <DialogTitle className="text-blue-400">
                          Add New Product Data
                        </DialogTitle>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label
                            htmlFor="product_id"
                            className="text-right text-gray-300"
                          >
                            Product ID
                          </Label>
                          <Input
                            id="product_id"
                            value={newProduct.product_id}
                            onChange={(e) =>
                              setNewProduct({
                                ...newProduct,
                                product_id: e.target.value,
                              })
                            }
                            className="col-span-3 bg-gray-700 border-gray-600 text-white"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label
                            htmlFor="date"
                            className="text-right text-gray-300"
                          >
                            Date
                          </Label>
                          <Input
                            id="date"
                            type="date"
                            value={newProduct.date}
                            onChange={(e) =>
                              setNewProduct({
                                ...newProduct,
                                date: e.target.value,
                              })
                            }
                            className="col-span-3 bg-gray-700 border-gray-600 text-white"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label
                            htmlFor="store_id"
                            className="text-right text-gray-300"
                          >
                            Store ID
                          </Label>
                          <Input
                            id="store_id"
                            value={newProduct.store_id}
                            onChange={(e) =>
                              setNewProduct({
                                ...newProduct,
                                store_id: e.target.value,
                              })
                            }
                            className="col-span-3 bg-gray-700 border-gray-600 text-white"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label
                            htmlFor="sales_quantity"
                            className="text-right text-gray-300"
                          >
                            Sales Quantity
                          </Label>
                          <Input
                            id="sales_quantity"
                            type="number"
                            value={newProduct.sales_quantity}
                            onChange={(e) =>
                              setNewProduct({
                                ...newProduct,
                                sales_quantity: e.target.value,
                              })
                            }
                            className="col-span-3 bg-gray-700 border-gray-600 text-white"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label
                            htmlFor="price"
                            className="text-right text-gray-300"
                          >
                            Price
                          </Label>
                          <Input
                            id="price"
                            type="number"
                            value={newProduct.price}
                            onChange={(e) =>
                              setNewProduct({
                                ...newProduct,
                                price: e.target.value,
                              })
                            }
                            className="col-span-3 bg-gray-700 border-gray-600 text-white"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label
                            htmlFor="promotions"
                            className="text-right text-gray-300"
                          >
                            Promotions
                          </Label>
                          <Select
                            value={newProduct.promotions}
                            onValueChange={(value) =>
                              setNewProduct({
                                ...newProduct,
                                promotions: value,
                              })
                            }
                          >
                            <SelectTrigger className="col-span-3 bg-gray-700 border-gray-600 text-white">
                              <SelectValue placeholder="Select promotion status" />
                            </SelectTrigger>
                            <SelectContent className="bg-gray-800 border-gray-700">
                              <SelectItem value="Yes">Yes</SelectItem>
                              <SelectItem value="No">No</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label
                            htmlFor="seasonality_factors"
                            className="text-right text-gray-300"
                          >
                            Seasonality Factors
                          </Label>
                          <Input
                            id="seasonality_factors"
                            value={newProduct.seasonality_factors}
                            onChange={(e) =>
                              setNewProduct({
                                ...newProduct,
                                seasonality_factors: e.target.value,
                              })
                            }
                            className="col-span-3 bg-gray-700 border-gray-600 text-white"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label
                            htmlFor="external_factors"
                            className="text-right text-gray-300"
                          >
                            External Factors
                          </Label>
                          <Input
                            id="external_factors"
                            value={newProduct.external_factors}
                            onChange={(e) =>
                              setNewProduct({
                                ...newProduct,
                                external_factors: e.target.value,
                              })
                            }
                            className="col-span-3 bg-gray-700 border-gray-600 text-white"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label
                            htmlFor="demand_trend"
                            className="text-right text-gray-300"
                          >
                            Demand Trend
                          </Label>
                          <Select
                            value={newProduct.demand_trend}
                            onValueChange={(value) =>
                              setNewProduct({
                                ...newProduct,
                                demand_trend: value,
                              })
                            }
                          >
                            <SelectTrigger className="col-span-3 bg-gray-700 border-gray-600 text-white">
                              <SelectValue placeholder="Select demand trend" />
                            </SelectTrigger>
                            <SelectContent className="bg-gray-800 border-gray-700">
                              <SelectItem value="Increasing">
                                Increasing
                              </SelectItem>
                              <SelectItem value="Decreasing">
                                Decreasing
                              </SelectItem>
                              <SelectItem value="Stable">Stable</SelectItem>
                              <SelectItem value="Seasonal">Seasonal</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label
                            htmlFor="customer_segments"
                            className="text-right text-gray-300"
                          >
                            Customer Segments
                          </Label>
                          <Select
                            value={newProduct.customer_segments}
                            onValueChange={(value) =>
                              setNewProduct({
                                ...newProduct,
                                customer_segments: value,
                              })
                            }
                          >
                            <SelectTrigger className="col-span-3 bg-gray-700 border-gray-600 text-white">
                              <SelectValue placeholder="Select customer segment" />
                            </SelectTrigger>
                            <SelectContent className="bg-gray-800 border-gray-700">
                              <SelectItem value="Regular">Regular</SelectItem>
                              <SelectItem value="Premium">Premium</SelectItem>
                              <SelectItem value="Bulk">Bulk</SelectItem>
                              <SelectItem value="New">New</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="flex justify-end gap-2 mt-4">
                          <Button
                            variant="outline"
                            onClick={() => setIsProductDialogOpen(false)}
                            className="text-gray-300 border-gray-600 hover:bg-gray-700"
                          >
                            Cancel
                          </Button>
                          <Button
                            onClick={handleAddProduct}
                            className="bg-blue-600 hover:bg-blue-700"
                          >
                            Add Product Data
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </motion.div>

              {/* Key Metrics Section */}
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="mb-8"
              >
                <KeyMetrics
                  inventoryData={filteredInventoryData}
                  pricingData={filteredPricingData}
                />
              </motion.div>

              {/* Main Dashboard Tabs */}
              <motion.div
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                className="mb-8"
              >
                <Tabs defaultValue="demand" className="w-full">
                  <TabsList className="grid grid-cols-3 mb-8 bg-gray-800/50 backdrop-blur-sm">
                    <TabsTrigger
                      value="demand"
                      className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-300"
                    >
                      Demand Forecasting
                    </TabsTrigger>
                    <TabsTrigger
                      value="inventory"
                      className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-300"
                    >
                      Inventory Monitoring
                    </TabsTrigger>
                    <TabsTrigger
                      value="pricing"
                      className="data-[state=active]:bg-fuchsia-500/20 data-[state=active]:text-fuchsia-300"
                    >
                      Pricing Optimization
                    </TabsTrigger>
                  </TabsList>

                  {/* Demand Forecasting Tab */}
                  <TabsContent value="demand">
                    <DemandForecasting
                      inventoryData={filteredInventoryData}
                      pricingData={filteredPricingData}
                      timeRange={timeRange}
                      productCategory={productCategory}
                    />
                  </TabsContent>

                  {/* Inventory Monitoring Tab */}
                  <TabsContent value="inventory">
                    <InventoryMonitoring
                      inventoryData={filteredInventoryData}
                      storeIds={storeIds}
                    />
                  </TabsContent>

                  {/* Pricing Optimization Tab */}
                  <TabsContent value="pricing">
                    <PricingOptimization
                      pricingData={filteredPricingData}
                      productCategory={productCategory}
                    />
                  </TabsContent>
                </Tabs>
              </motion.div>

              {/* Recommendations Section */}
              <motion.div
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                className="mb-8"
              >
                <Recommendations
                  inventoryData={filteredInventoryData}
                  pricingData={filteredPricingData}
                />
              </motion.div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
