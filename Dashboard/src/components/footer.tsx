"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Twitter, Linkedin, Github, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function Footer() {
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

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  }

  const socialIcons = [
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Linkedin, href: "#", label: "LinkedIn" },
    { icon: Github, href: "#", label: "GitHub" },
  ]

  const footerLinks = [
    {
      title: "Product",
      links: ["Features", "Pricing", "Case Studies", "Documentation", "Resources"],
    },
    {
      title: "Company",
      links: ["About Us", "Careers", "Blog", "Press", "Contact"],
    },
    {
      title: "Legal",
      links: ["Terms of Service", "Privacy Policy", "Cookie Policy", "GDPR"],
    },
  ]

  return (
    <footer ref={ref} id="contact" className="bg-[#0a0a0f] border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12"
        >
          {/* Company Info */}
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-6">
              <div className="relative w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-fuchsia-600 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-600 to-fuchsia-600 opacity-70 blur-sm"></div>
                <span className="relative text-white font-bold text-xl">RI</span>
              </div>
              <span className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-fuchsia-500">
                RetailAI
              </span>
            </div>
            <p className="text-gray-400 mb-6 max-w-md">
              Revolutionizing retail inventory management with multi-agent AI systems. Our solution optimizes stock
              levels, predicts demand, and improves operational efficiency.
            </p>
            <div className="flex space-x-4">
              {socialIcons.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:text-white hover:bg-purple-600 transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Footer Links */}
          {footerLinks.map((column) => (
            <motion.div key={column.title} variants={itemVariants}>
              <h3 className="text-white font-semibold mb-4">{column.title}</h3>
              <ul className="space-y-3">
                {column.links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>

        {/* Newsletter */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="mt-16 pt-8 border-t border-gray-800"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <motion.div variants={itemVariants}>
              <h3 className="text-xl font-semibold text-white mb-2">Subscribe to our newsletter</h3>
              <p className="text-gray-400">Get the latest updates on our products and services.</p>
            </motion.div>
            <motion.div variants={itemVariants}>
              <div className="flex space-x-2">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="bg-gray-800 border-gray-700 text-white focus:ring-purple-500 focus:border-purple-500"
                />
                <Button className="bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-700 hover:to-fuchsia-700 text-white">
                  <Send className="w-4 h-4 mr-2" />
                  Subscribe
                </Button>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Copyright */}
        <motion.div variants={itemVariants} className="mt-16 text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} RetailAI. All rights reserved.</p>
        </motion.div>
      </div>
    </footer>
  )
}

