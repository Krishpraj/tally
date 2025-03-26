"use client"

import { useEffect, useRef } from "react"

export default function TaxBreakdownChart() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    // Tax bracket data for 2023 (single filer)
    const brackets = [
      { rate: 0.1, limit: 11000, color: "#4ade80" },
      { rate: 0.12, limit: 44725, color: "#22c55e" },
      { rate: 0.22, limit: 95375, color: "#16a34a" },
      { rate: 0.24, limit: 182100, color: "#15803d" },
      { rate: 0.32, limit: 231250, color: "#166534" },
      { rate: 0.35, limit: 578125, color: "#14532d" },
      { rate: 0.37, limit: Number.POSITIVE_INFINITY, color: "#052e16" },
    ]

    // Chart dimensions
    const margin = { top: 20, right: 20, bottom: 40, left: 60 }
    const width = canvas.width - margin.left - margin.right
    const height = canvas.height - margin.top - margin.bottom

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.translate(margin.left, margin.top)

    // Max income to display (for x-axis scale)
    const maxIncome = 200000

    // Scale functions
    const xScale = (income: number) => (income / maxIncome) * width
    const yScale = (rate: number) => height - rate * height

    // Draw x-axis
    ctx.beginPath()
    ctx.moveTo(0, height)
    ctx.lineTo(width, height)
    ctx.strokeStyle = "#94a3b8"
    ctx.stroke()

    // Draw y-axis
    ctx.beginPath()
    ctx.moveTo(0, 0)
    ctx.lineTo(0, height)
    ctx.strokeStyle = "#94a3b8"
    ctx.stroke()

    // Draw x-axis labels
    ctx.textAlign = "center"
    ctx.fillStyle = "#64748b"
    ctx.font = "12px Inter, sans-serif"
    for (let i = 0; i <= maxIncome; i += 50000) {
      const x = xScale(i)
      ctx.fillText(`$${i / 1000}k`, x, height + 20)

      // Draw grid line
      ctx.beginPath()
      ctx.moveTo(x, height)
      ctx.lineTo(x, 0)
      ctx.strokeStyle = "#e2e8f0"
      ctx.stroke()
    }

    // Draw y-axis labels
    ctx.textAlign = "right"
    ctx.fillStyle = "#64748b"
    for (let i = 0; i <= 0.4; i += 0.05) {
      const y = yScale(i)
      ctx.fillText(`${Math.round(i * 100)}%`, -10, y + 5)

      // Draw grid line
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(width, y)
      ctx.strokeStyle = "#e2e8f0"
      ctx.stroke()
    }

    // Draw tax brackets
    let prevX = 0
    brackets.forEach((bracket, index) => {
      const x = xScale(Math.min(bracket.limit, maxIncome))

      // Draw rectangle for bracket
      ctx.fillStyle = bracket.color
      ctx.globalAlpha = 0.7
      ctx.fillRect(prevX, yScale(bracket.rate), x - prevX, height - yScale(bracket.rate))

      // Draw bracket rate text
      if (x - prevX > 40) {
        ctx.fillStyle = "#ffffff"
        ctx.globalAlpha = 1
        ctx.textAlign = "center"
        ctx.font = "bold 14px Inter, sans-serif"
        ctx.fillText(`${Math.round(bracket.rate * 100)}%`, prevX + (x - prevX) / 2, yScale(bracket.rate) + 20)
      }

      prevX = x
      if (bracket.limit >= maxIncome) return
    })

    // Reset global alpha
    ctx.globalAlpha = 1

    // Draw title
    ctx.textAlign = "center"
    ctx.fillStyle = "#1e293b"
    ctx.font = "bold 16px Inter, sans-serif"
    ctx.fillText("2023 Federal Income Tax Brackets (Single Filer)", width / 2, -5)
  }, [])

  return (
    <div className="w-full h-[300px] relative">
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  )
}

