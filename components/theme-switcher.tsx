"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Sun, Moon, Palette, Check } from "lucide-react"
import { cn } from "@/lib/utils"

type Theme = 'beige' | 'dark' | 'blue' | 'green' | 'purple'

export function ThemeSwitcher() {
  const [currentTheme, setCurrentTheme] = useState<Theme>('beige')
  const [isOpen, setIsOpen] = useState(false)
  
  // Theme colors for the switcher UI
  const themeColors = {
    beige: "bg-amber-200 border-amber-400",
    dark: "bg-slate-800 border-slate-600",
    blue: "bg-blue-200 border-blue-400",
    green: "bg-emerald-200 border-emerald-400",
    purple: "bg-purple-200 border-purple-600"
  }
  
  // Apply theme when changed
  useEffect(() => {
    if (currentTheme === 'beige') {
      document.documentElement.classList.remove('theme-blue', 'theme-green', 'theme-purple', 'dark')
      document.documentElement.classList.add('theme-beige')
    } else if (currentTheme === 'dark') {
      document.documentElement.classList.remove('theme-beige', 'theme-blue', 'theme-green', 'theme-purple')
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
      document.documentElement.classList.remove('theme-beige', 'theme-blue', 'theme-green', 'theme-purple')
      document.documentElement.classList.add(`theme-${currentTheme}`)
    }
    
    // Save theme preference
    localStorage.setItem('taly-theme', currentTheme)
  }, [currentTheme])
  
  // Load saved theme on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('taly-theme') as Theme
    if (savedTheme) {
      setCurrentTheme(savedTheme)
    }
  }, [])

  return (
    <div className="fixed right-4 top-4 z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="rounded-full p-2 bg-white dark:bg-slate-800 shadow-md hover:shadow-lg transition-all duration-200"
        aria-label="Change theme"
      >
        {currentTheme === 'beige' && <Palette className="h-5 w-5 text-amber-600" />}
        {currentTheme === 'dark' && <Moon className="h-5 w-5 text-slate-400" />}
        {currentTheme === 'blue' && <Palette className="h-5 w-5 text-blue-600" />}
        {currentTheme === 'green' && <Palette className="h-5 w-5 text-emerald-600" />}
        {currentTheme === 'purple' && <Palette className="h-5 w-5 text-purple-600" />}
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 p-3 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-gray-100 dark:border-slate-700 w-[180px]"
          >
            <h3 className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Choose Theme</h3>
            <div className="space-y-2">
              <ThemeOption 
                theme="beige"
                label="Beige"
                current={currentTheme}
                onClick={() => { setCurrentTheme('beige'); setIsOpen(false); }}
                className={themeColors.beige}
              />
              <ThemeOption 
                theme="dark"
                label="Dark"
                current={currentTheme}
                onClick={() => { setCurrentTheme('dark'); setIsOpen(false); }}
                className={themeColors.dark}
              />
              <ThemeOption 
                theme="blue"
                label="Blue"
                current={currentTheme}
                onClick={() => { setCurrentTheme('blue'); setIsOpen(false); }}
                className={themeColors.blue}
              />
              <ThemeOption 
                theme="green"
                label="Green"
                current={currentTheme}
                onClick={() => { setCurrentTheme('green'); setIsOpen(false); }}
                className={themeColors.green}
              />
              <ThemeOption 
                theme="purple"
                label="Purple"
                current={currentTheme}
                onClick={() => { setCurrentTheme('purple'); setIsOpen(false); }}
                className={themeColors.purple}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function ThemeOption({ theme, label, current, onClick, className }: {
  theme: Theme,
  label: string,
  current: Theme,
  onClick: () => void,
  className: string
}) {
  const isActive = theme === current
  
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center w-full px-2 py-1.5 rounded-lg text-left transition-all",
        isActive ? "ring-2 ring-offset-2" : "hover:bg-gray-100 dark:hover:bg-slate-700"
      )}
    >
      <span className={cn("w-5 h-5 rounded-full border mr-2", className)}>{
        isActive && <Check className="h-3 w-3 m-auto text-gray-700 dark:text-white" />
      }</span>
      <span className="text-sm text-gray-700 dark:text-gray-300">{label}</span>
    </button>
  )
}

// Import AnimatePresence from framer-motion
import { AnimatePresence } from "framer-motion"