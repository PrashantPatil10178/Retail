"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { AlertTriangle, TrendingDown, Package } from "lucide-react"

const challenges = [
  {
    title: "Stockouts",
    description: "Running out of popular items leads to lost sales.",
    animation: "fade-in",
    icon: AlertTriangle,
    color: "from-red-500 to-orange-500",
  },
  {
    title: "Overstocking",
    description: "Excess inventory increases holding costs.",
    animation: "slide-up",
    icon: Package,
    color: "from-blue-500 to-cyan-500",
  },
  {
    title: "Manual Processes",
    description: "Retail managers rely on outdated manual tracking.",
    animation: "zoom-in",
    icon: TrendingDown,
    color: "from-purple-500 to-fuchsia-500",
  },
]

export default function ChallengeOverview() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: false, amount: 0.3 })

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  }

  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, delay: i * 0.1 },
    }),
  }

  return (
    <section ref={ref} className="py-20 px-4 bg-gradient-to-b from-[#0a0a0f] to-[#0f0f1a]">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={containerVariants}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
        >
          <div className="space-y-8">
            <motion.h2
              custom={0}
              variants={textVariants}
              className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-fuchsia-500"
            >
              Challenge Overview
            </motion.h2>

            <motion.div custom={1} variants={textVariants} className="space-y-4">
              <p className="text-gray-300 text-lg leading-relaxed">
                In the rapidly evolving retail industry, maintaining an optimal balance between product availability and
                inventory costs is a key challenge.
              </p>
              <p className="text-gray-300 text-lg leading-relaxed">
                Retail chains often face issues of stockouts (running out of popular items) or overstocking (leading to
                higher holding costs).
              </p>
              <p className="text-gray-300 text-lg leading-relaxed">
                To address these challenges, we've designed a multi-agent AI system that collaborates between stores,
                warehouses, suppliers, and customers to optimize inventory management.
              </p>
            </motion.div>

            <motion.div custom={2} variants={textVariants} className="pt-4">
              <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-purple-900/20 border border-purple-500/30">
                <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></span>
                <span className="text-purple-300 font-medium">AI-Powered Solution</span>
              </div>
            </motion.div>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="grid grid-cols-1 gap-6"
          >
            {challenges.map((challenge, index) => (
              <motion.div
                key={challenge.title}
                variants={itemVariants}
                className="relative overflow-hidden rounded-xl bg-gradient-to-r from-gray-900/50 to-gray-800/50 backdrop-blur-sm border border-gray-700/50 p-6 hover:border-purple-500/30 transition-colors group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-900/5 to-fuchsia-900/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                <div className="flex items-start space-x-4">
                  <div className={`p-3 rounded-lg bg-gradient-to-br ${challenge.color} bg-opacity-10`}>
                    <challenge.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">{challenge.title}</h3>
                    <p className="text-gray-300">{challenge.description}</p>
                  </div>
                </div>

                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

