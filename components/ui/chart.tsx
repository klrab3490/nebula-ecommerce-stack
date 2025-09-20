import * as React from "react"
import { cn } from "@/lib/utils"

interface ChartData {
  name: string
  value: number
  color?: string
}

interface ChartProps extends React.HTMLAttributes<HTMLDivElement> {
  data: ChartData[]
  height?: number
  type?: "bar" | "line" | "area"
}

const Chart = React.forwardRef<HTMLDivElement, ChartProps>(
  ({ className, data, height = 200, type = "bar", ...props }, ref) => {
    const maxValue = Math.max(...data.map(item => item.value))

    if (type === "bar") {
      return (
        <div
          ref={ref}
          className={cn("w-full", className)}
          style={{ height }}
          {...props}
        >
          <div className="flex items-end justify-between h-full gap-2 p-4">
            {data.map((item, index) => (
              <div key={index} className="flex flex-col items-center gap-2 flex-1">
                <div
                  className={cn(
                    "w-full rounded-t-md transition-all duration-300",
                    item.color || "bg-primary"
                  )}
                  style={{
                    height: `${(item.value / maxValue) * (height - 60)}px`,
                    minHeight: "4px"
                  }}
                />
                <div className="text-xs text-center text-muted-foreground">
                  {item.name}
                </div>
                <div className="text-sm font-medium">
                  {item.value}
                </div>
              </div>
            ))}
          </div>
        </div>
      )
    }

    // Simple line chart
    return (
      <div
        ref={ref}
        className={cn("w-full relative", className)}
        style={{ height }}
        {...props}
      >
        <svg className="w-full h-full">
          <polyline
            fill="none"
            stroke="hsl(var(--primary))"
            strokeWidth="2"
            points={data.map((item, index) => {
              const x = (index / (data.length - 1)) * 100
              const y = 100 - ((item.value / maxValue) * 80)
              return `${x},${y}`
            }).join(" ")}
          />
          {data.map((item, index) => {
            const x = (index / (data.length - 1)) * 100
            const y = 100 - ((item.value / maxValue) * 80)
            return (
              <circle
                key={index}
                cx={`${x}%`}
                cy={`${y}%`}
                r="4"
                fill="hsl(var(--primary))"
              />
            )
          })}
        </svg>
      </div>
    )
  }
)
Chart.displayName = "Chart"

export { Chart }
export type { ChartData }