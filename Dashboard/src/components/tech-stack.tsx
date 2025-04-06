"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Brain, Cloud, Database, BarChart3, Cpu, Network } from "lucide-react"

const technologies = [
  {
    name: "AI",
    icon: Brain,
    color: "from-purple-600 to-fuchsia-600",
    description: "Advanced machine learning algorithms",
  },
  {
    name: "ML",
    icon: Cpu,
    color: "from-blue-600 to-cyan-600",
    description: "Predictive modeling & pattern recognition",
  },
  {
    name: "Cloud",
    icon: Cloud,
    color: "from-sky-600 to-indigo-600",
    description: "Scalable cloud infrastructure",
  },
  {
    name: "Data Analytics",
    icon: BarChart3,
    color: "from-green-600 to-emerald-600",
    description: "Real-time data processing & insights",
  },
  {
    name: "Database",
    icon: Database,
    color: "from-amber-600 to-orange-600",
    description: "High-performance data storage",
  },
  {
    name: "Multi-Agent",
    icon: Network,
    color: "from-red-600 to-pink-600",
    description: "Collaborative AI agent systems",
  },
]

export default function TechStack() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: false, amount: 0.2 })

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
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
    <section ref={ref} id="tech" className="py-20 px-4 bg-gradient-to-b from-[#0a0a0f] to-[#0f0f1a]">
      <div className="max-w-7xl mx-auto">
        <motion.div
          variants={headerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-fuchsia-500 mb-4">
            Technology Stack
          </h2>
          <p className="text-gray-300 text-lg max-w-3xl mx-auto">
            Our solution leverages cutting-edge technologies to deliver powerful inventory management capabilities.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6"
        >
          {technologies.map((tech, index) => (
            <TechBadge key={tech.name} tech={tech} index={index} />
          ))}
        </motion.div>
      </div>
    </section>
  )
}

function TechBadge({ tech, index }: { tech: any; index: number }) {
  const badgeVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, delay: index * 0.1 },
    },
    hover: {
      scale: 1.05,
      boxShadow: "0 0 20px rgba(168, 85, 247, 0.5)",
      transition: { duration: 0.3 },
    },
  }

  return (
    <motion.div variants={badgeVariants} whileHover="hover" className="flex flex-col items-center">
      <div className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-fuchsia-600 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
        <div className={`relative w-24 h-24 rounded-full bg-gradient-to-br ${tech.color} p-1`}>
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-gray-900 to-gray-800 m-0.5"></div>
          <div className="relative h-full w-full flex items-center justify-center">
            <tech.icon className="w-10 h-10 text-white" />
          </div>
        </div>
      </div>
      <h3 className="mt-4 text-lg font-semibold text-white">{tech.name}</h3>
      <p className="mt-1 text-xs text-gray-400 text-center">{tech.description}</p>
    </motion.div>
  )
}

