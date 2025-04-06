"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import dynamic from "next/dynamic";

// Dynamically import Lottie to avoid SSR issues
const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

import { animationData } from "../animations/ai-animation"; // Ensure correct import

export default function HeroSection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // Optimize animations for smoother performance
  const y = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  // Prevent animation from loading on the server
  const [isClient, setIsClient] = useState(false);
  useEffect(() => setIsClient(true), []);

  return (
    <motion.section
      ref={ref}
      className="relative min-h-screen flex items-center justify-center overflow-hidden py-20 px-4 will-change-transform hardware-accelerated"
      id="overview"
      style={{ opacity }}
    >
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0f] via-[#0a0a0f]/90 to-[#0a0a0f]" />
        {isClient && (
          <Lottie
            animationData={animationData}
            className="w-full h-full object-cover"
          />
        )}
      </div>

      <div className="max-w-7xl mx-auto relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-6"
        >
          <div className="inline-block px-4 py-1 rounded-full bg-gradient-to-r from-purple-900/30 to-fuchsia-900/30 backdrop-blur-sm border border-purple-500/20 text-sm font-medium text-purple-300 mb-6">
            Next-Gen Retail Solution
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
          className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-200 to-fuchsia-200"
        >
          Revolutionizing Retail Inventory with AI Agents
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-10"
        >
          Intelligent solutions for demand forecasting, inventory optimization,
          and real-time analytics powered by multi-agent AI systems.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <motion.div
            whileHover={{
              scale: 1.03,
              boxShadow: "0 0 25px rgba(168, 85, 247, 0.5)",
            }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="relative group"
          >
            <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-fuchsia-600 rounded-lg blur opacity-60 group-hover:opacity-100 transition duration-500 group-hover:duration-200"></div>
            <Button className="relative bg-[#0a0a0f] hover:bg-[#0a0a0f]/80 text-white px-8 py-6 rounded-lg font-medium text-lg flex items-center gap-2">
              Explore Solution
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </motion.div>

          <Button
            variant="outline"
            className="border-purple-500/30 text-purple-300 hover:bg-purple-500/10 px-8 py-6 rounded-lg font-medium text-lg"
          >
            Watch Demo
          </Button>
        </motion.div>
      </div>

      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2">
        <motion.div
          animate={{
            y: [0, 8, 0],
          }}
          transition={{
            duration: 1.5,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "loop",
            ease: "easeInOut",
          }}
          className="w-6 h-10 rounded-full border-2 border-purple-500/50 flex justify-center items-start p-1"
        >
          <motion.div
            animate={{
              y: [0, 10, 0],
            }}
            transition={{
              duration: 1.5,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "loop",
              ease: "easeInOut",
            }}
            className="w-1.5 h-3 bg-purple-500 rounded-full"
          />
        </motion.div>
      </div>
    </motion.section>
  );
}
