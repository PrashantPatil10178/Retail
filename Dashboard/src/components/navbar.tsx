"use client";

import { useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { scrollY } = useScroll();
  const backgroundColor = useTransform(
    scrollY,
    [0, 100],
    ["rgba(10, 10, 15, 0)", "rgba(10, 10, 15, 0.8)"]
  );
  const backdropFilter = useTransform(
    scrollY,
    [0, 100],
    ["blur(0px)", "blur(8px)"]
  );

  const logoVariants = {
    initial: { opacity: 0, y: -10 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.4 } },
    hover: {
      scale: 1.05,
      filter: "drop-shadow(0 0 8px rgba(168, 85, 247, 0.7))",
      transition: { duration: 0.2, ease: "easeOut" },
    },
  };

  interface NavItemVariants {
    [key: string]: any;
    initial: { opacity: number; y: number };
    animate: (i: number) => {
      opacity: number;
      y: number;
      transition: { duration: number; delay: number };
    };
    hover: {
      scale: number;
      color: string;
      transition: { duration: number; ease: string };
    };
  }

  const navItemVariants: NavItemVariants = {
    initial: { opacity: 0, y: -10 },
    animate: (i) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, delay: 0.05 * i },
    }),
    hover: {
      scale: 1.05,
      color: "#d946ef",
      transition: { duration: 0.2, ease: "easeOut" },
    },
  };

  const navLinks = [
    { name: "Overview", href: "#overview" },
    { name: "Process", href: "#process" },
    { name: "Tech", href: "#tech" },
    { name: "Dashboard", href: "#dashboard" },
    { name: "Contact", href: "#contact" },
  ];

  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-50 px-4 py-3 md:px-8 md:py-4"
      style={{ backgroundColor, backdropFilter }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <motion.div
          className="flex items-center"
          variants={logoVariants}
          initial="initial"
          animate="animate"
          whileHover="hover"
        >
          <a href="/" className="flex items-center space-x-2">
            <div className="relative w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-fuchsia-600 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-600 to-fuchsia-600 opacity-70 blur-sm"></div>
              <span className="relative text-white font-bold text-xl">RI</span>
            </div>
            <span className="font-bold text-xl md:text-2xl bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-fuchsia-500">
              RetailAI
            </span>
          </a>
        </motion.div>

        <div className="hidden md:flex items-center space-x-8">
          <nav className="flex items-center space-x-6">
            {navLinks.map((link, i) => (
              <motion.div
                key={link.name}
                custom={i}
                variants={navItemVariants}
                initial="initial"
                animate="animate"
                whileHover="hover"
              >
                <a
                  href={link.href}
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  {link.name}
                </a>
              </motion.div>
            ))}
          </nav>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            whileHover={{
              scale: 1.05,
              boxShadow: "0 0 15px rgba(217, 70, 239, 0.5)",
            }}
          >
            <Button className="bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-700 hover:to-fuchsia-700 text-white px-6 py-2 rounded-md font-medium">
              Get Started
            </Button>
          </motion.div>
        </div>

        <div className="md:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(!isOpen)}
            className="text-gray-300"
          >
            <Menu className="h-6 w-6" />
          </Button>
        </div>
      </div>

      <motion.div
        className={cn(
          "absolute top-full left-0 right-0 bg-[#0a0a0f]/95 backdrop-blur-md md:hidden",
          isOpen ? "block" : "hidden"
        )}
        initial={{ opacity: 0, height: 0 }}
        animate={{
          opacity: isOpen ? 1 : 0,
          height: isOpen ? "auto" : 0,
        }}
        transition={{ duration: 0.3 }}
      >
        <div className="px-4 py-4 space-y-4">
          <nav className="flex flex-col space-y-4">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-gray-300 hover:text-white py-2 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </a>
            ))}
          </nav>
          <Button className="w-full bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-700 hover:to-fuchsia-700 text-white px-6 py-2 rounded-md font-medium">
            Get Started
          </Button>
        </div>
      </motion.div>
    </motion.header>
  );
}
