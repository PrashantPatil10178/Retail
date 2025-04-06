"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { TrendingUp, ClipboardCheck, DollarSign } from "lucide-react"

const processCards = [
  {
    title: "Demand Forecasting",
    description: "Using AI to predict product demand accurately.",
    icon: TrendingUp,
    animation: "slide-in-left",
    details:
      "Our AI analyzes historical sales data, market trends, seasonal patterns, and external factors to generate precise demand forecasts for each product in your inventory.",
  },
  {
    title: "Inventory Monitoring",
    description: "Real-time stock level tracking and updates.",
    icon: ClipboardCheck,
    animation: "slide-in-right",
    details:
      "Automated tracking systems continuously monitor inventory levels across all locations, providing real-time visibility and eliminating the need for manual stock checks.",
  },
  {
    title: "Pricing Optimization",
    description: "Dynamic pricing strategies based on AI insights.",
    icon: DollarSign,
    animation: "fade-in",
    details:
      "Our AI engine analyzes market conditions, competitor pricing, and inventory levels to recommend optimal pricing strategies that maximize revenue and reduce excess stock.",
  },
]

export default function CurrentProcess() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: false, amount: 0.2 })

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const headerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  }

  return (
    <section ref={ref} id="process" className="py-20 px-4 bg-gradient-to-b from-[#0f0f1a] to-[#0a0a0f]">
      <div className="max-w-7xl mx-auto">
        <motion.div
          variants={headerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-fuchsia-500 mb-4">
            Current Process
          </h2>
          <p className="text-gray-300 text-lg max-w-3xl mx-auto">
            Our AI-powered solution transforms traditional retail processes into intelligent, automated systems that
            optimize inventory management.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {processCards.map((card, index) => (
            <ProcessCard key={card.title} card={card} index={index} />
          ))}
        </motion.div>
      </div>
    </section>
  )
}

// Optimize card flip animation for smoother performance
function ProcessCard({ card, index }: { card: any; index: number }) {
  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, delay: index * 0.1, ease: "easeOut" },
    },
  }

  return (
    <motion.div
      variants={cardVariants}
      className="group relative h-[400px] perspective-1000 will-change-transform hardware-accelerated"
    >
      <motion.div
        className="relative w-full h-full transition-all duration-500 preserve-3d group-hover:rotate-y-180"
        style={{
          transformStyle: "preserve-3d",
          willChange: "transform",
        }}
      >
        {/* Front of card */}
        <div className="absolute inset-0 backface-hidden rounded-xl bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 p-8 flex flex-col">
          <div className="flex items-center justify-center w-16 h-16 rounded-lg bg-gradient-to-br from-purple-600/20 to-fuchsia-600/20 mb-6">
            <card.icon className="w-8 h-8 text-purple-400" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-4">{card.title}</h3>
          <p className="text-gray-300 mb-6">{card.description}</p>
          <div className="mt-auto">
            <div className="text-sm text-purple-400 flex items-center">
              <span>Flip for details</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>

          {/* Glowing border effect */}
          <div className="absolute inset-0 rounded-xl border border-transparent group-hover:border-purple-500/50 transition-colors duration-300"></div>
          <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-purple-600/5 to-fuchsia-600/5"></div>

          {/* Pulse effect */}
          <div className="absolute -inset-px rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-600/0 via-purple-600/30 to-fuchsia-600/0 blur-sm animate-pulse-slow"></div>
          </div>
        </div>

        {/* Back of card */}
        <div className="absolute inset-0 backface-hidden rotate-y-180 rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 border border-purple-500/30 p-8 flex flex-col">
          <div className="flex items-center justify-center w-16 h-16 rounded-lg bg-gradient-to-br from-purple-600/20 to-fuchsia-600/20 mb-6">
            <card.icon className="w-8 h-8 text-purple-400" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-4">{card.title}</h3>
          <p className="text-gray-300">{card.details}</p>
          <div className="mt-auto">
            <div className="text-sm text-purple-400 flex items-center">
              <span>Flip back</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 ml-1 rotate-180 group-hover:-translate-x-1 transition-transform"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>

          {/* Glowing border effect */}
          <div className="absolute inset-0 rounded-xl border border-purple-500/50"></div>
          <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-purple-600/5 to-fuchsia-600/5"></div>
        </div>
      </motion.div>
    </motion.div>
  )
}

