"use client"
import { AxisBottom, AxisLeft } from "@visx/axis"
import { Grid } from "@visx/grid"
import { Group } from "@visx/group"
import { scaleBand, scaleLinear, scaleOrdinal } from "@visx/scale"
import { Bar } from "@visx/shape"
import { LinePath } from "@visx/shape"
import { curveMonotoneX } from "@visx/curve"
import { Pie } from "@visx/shape"
import { Text } from "@visx/text"
import { localPoint } from "@visx/event"
import { useTooltip, useTooltipInPortal, defaultStyles } from "@visx/tooltip"
import { LegendOrdinal } from "@visx/legend"
import { ParentSize } from "@visx/responsive"

// Bar Chart
export function BarChart({
  data,
  index,
  categories,
  colors,
  valueFormatter,
  yAxisWidth = 56,
}: {
  data: any[]
  index: string
  categories: string[]
  colors: string[]
  valueFormatter?: (value: number) => string
  yAxisWidth?: number
}) {
  const tooltipStyles = {
    ...defaultStyles,
    backgroundColor: "rgba(15, 15, 25, 0.9)",
    border: "1px solid rgba(168, 85, 247, 0.2)",
    color: "white",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
    borderRadius: "6px",
    padding: "8px 12px",
    fontSize: "12px",
  }

  const { tooltipOpen, tooltipLeft, tooltipTop, tooltipData, hideTooltip, showTooltip } = useTooltip<any>()

  const { containerRef, TooltipInPortal } = useTooltipInPortal({
    scroll: true,
    detectBounds: true,
  })

  const formatValue = valueFormatter || ((value: number) => `${value}`)

  return (
    <ParentSize className="h-full w-full">
      {({ width, height }) => {
        // Bounds
        const margin = { top: 20, right: 20, bottom: 40, left: yAxisWidth }
        const innerWidth = width - margin.left - margin.right
        const innerHeight = height - margin.top - margin.bottom

        // Scales
        const xScale = scaleBand<string>({
          domain: data.map((d) => d[index]),
          range: [0, innerWidth],
          padding: 0.3,
        })

        const yScale = scaleLinear<number>({
          domain: [0, Math.max(...data.map((d) => Math.max(...categories.map((c) => Number(d[c] || 0))))) * 1.1],
          range: [innerHeight, 0],
          nice: true,
        })

        const colorScale = scaleOrdinal<string, string>({
          domain: categories,
          range: colors,
        })

        return (
          <div ref={containerRef} className="relative h-full w-full">
            <svg width={width} height={height}>
              <Group left={margin.left} top={margin.top}>
                <Grid
                  xScale={xScale}
                  yScale={yScale}
                  width={innerWidth}
                  height={innerHeight}
                  stroke="rgba(255, 255, 255, 0.1)"
                  strokeDasharray="4,4"
                />
                <AxisLeft
                  scale={yScale}
                  tickFormat={(value) => formatValue(Number(value))}
                  stroke="rgba(255, 255, 255, 0.2)"
                  tickStroke="rgba(255, 255, 255, 0.2)"
                  tickLabelProps={{
                    fill: "rgba(255, 255, 255, 0.6)",
                    fontSize: 12,
                    textAnchor: "end",
                    dx: -4,
                    dy: 4,
                  }}
                />
                <AxisBottom
                  top={innerHeight}
                  scale={xScale}
                  stroke="rgba(255, 255, 255, 0.2)"
                  tickStroke="rgba(255, 255, 255, 0.2)"
                  tickLabelProps={{
                    fill: "rgba(255, 255, 255, 0.6)",
                    fontSize: 12,
                    textAnchor: "middle",
                    dy: 4,
                  }}
                />
                {data.map((d) => {
                  const category = categories[0]
                  const value = d[category]
                  const barWidth = xScale.bandwidth()
                  const barHeight = innerHeight - (yScale(Number(value)) || 0)
                  const barX = xScale(d[index]) || 0
                  const barY = innerHeight - barHeight

                  return (
                    <Bar
                      key={`bar-${d[index]}`}
                      x={barX}
                      y={barY}
                      width={barWidth}
                      height={barHeight}
                      fill={colorScale(category)}
                      opacity={0.8}
                      rx={4}
                      onMouseLeave={() => hideTooltip()}
                      onMouseMove={(event) => {
                        const point = localPoint(event) || { x: 0, y: 0 }
                        showTooltip({
                          tooltipData: d,
                          tooltipTop: point.y,
                          tooltipLeft: point.x,
                        })
                      }}
                    />
                  )
                })}
              </Group>
            </svg>
            {tooltipOpen && tooltipData && (
              <TooltipInPortal top={tooltipTop} left={tooltipLeft} style={tooltipStyles}>
                <div className="font-medium mb-1">{tooltipData[index]}</div>
                {categories.map((category) => (
                  <div key={category} className="flex items-center justify-between gap-2">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: colorScale(category) }} />
                      <span>{category}:</span>
                    </div>
                    <span className="font-medium">{formatValue(Number(tooltipData[category]))}</span>
                  </div>
                ))}
              </TooltipInPortal>
            )}
            <div
              style={{
                position: "absolute",
                top: margin.top / 2,
                right: margin.right,
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                fontSize: "12px",
              }}
            >
              <LegendOrdinal
                scale={colorScale}
                direction="row"
                labelMargin="0 15px 0 0"
                shape="circle"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: "12px",
                  color: "rgba(255, 255, 255, 0.7)",
                }}
              />
            </div>
          </div>
        )
      }}
    </ParentSize>
  )
}

// Line Chart
export function LineChart({
  data,
  index,
  categories,
  colors,
  valueFormatter,
  yAxisWidth = 56,
}: {
  data: any[]
  index: string
  categories: string[]
  colors: string[]
  valueFormatter?: (value: number) => string
  yAxisWidth?: number
}) {
  const tooltipStyles = {
    ...defaultStyles,
    backgroundColor: "rgba(15, 15, 25, 0.9)",
    border: "1px solid rgba(168, 85, 247, 0.2)",
    color: "white",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
    borderRadius: "6px",
    padding: "8px 12px",
    fontSize: "12px",
  }

  const { tooltipOpen, tooltipLeft, tooltipTop, tooltipData, hideTooltip, showTooltip } = useTooltip<any>()

  const { containerRef, TooltipInPortal } = useTooltipInPortal({
    scroll: true,
    detectBounds: true,
  })

  const formatValue = valueFormatter || ((value: number) => `${value}`)

  return (
    <ParentSize className="h-full w-full">
      {({ width, height }) => {
        // Bounds
        const margin = { top: 20, right: 20, bottom: 40, left: yAxisWidth }
        const innerWidth = width - margin.left - margin.right
        const innerHeight = height - margin.top - margin.bottom

        // Scales
        const xScale = scaleBand<string>({
          domain: data.map((d) => d[index]),
          range: [0, innerWidth],
          padding: 0.3,
        })

        const yScale = scaleLinear<number>({
          domain: [0, Math.max(...data.map((d) => Math.max(...categories.map((c) => Number(d[c] || 0))))) * 1.1],
          range: [innerHeight, 0],
          nice: true,
        })

        const colorScale = scaleOrdinal<string, string>({
          domain: categories,
          range: colors,
        })

        return (
          <div ref={containerRef} className="relative h-full w-full">
            <svg width={width} height={height}>
              <Group left={margin.left} top={margin.top}>
                <Grid
                  xScale={xScale}
                  yScale={yScale}
                  width={innerWidth}
                  height={innerHeight}
                  stroke="rgba(255, 255, 255, 0.1)"
                  strokeDasharray="4,4"
                />
                <AxisLeft
                  scale={yScale}
                  tickFormat={(value) => formatValue(Number(value))}
                  stroke="rgba(255, 255, 255, 0.2)"
                  tickStroke="rgba(255, 255, 255, 0.2)"
                  tickLabelProps={{
                    fill: "rgba(255, 255, 255, 0.6)",
                    fontSize: 12,
                    textAnchor: "end",
                    dx: -4,
                    dy: 4,
                  }}
                />
                <AxisBottom
                  top={innerHeight}
                  scale={xScale}
                  stroke="rgba(255, 255, 255, 0.2)"
                  tickStroke="rgba(255, 255, 255, 0.2)"
                  tickLabelProps={{
                    fill: "rgba(255, 255, 255, 0.6)",
                    fontSize: 12,
                    textAnchor: "middle",
                    dy: 4,
                  }}
                />
                {categories.map((category, i) => {
                  const lineData = data.filter((d) => d[category] !== null)

                  return (
                    <LinePath
                      key={`line-${category}`}
                      data={lineData}
                      x={(d) => (xScale(d[index]) || 0) + xScale.bandwidth() / 2}
                      y={(d) => yScale(Number(d[category])) || 0}
                      stroke={colorScale(category)}
                      strokeWidth={3}
                      curve={curveMonotoneX}
                      opacity={0.8}
                    />
                  )
                })}

                {categories.map((category, i) => {
                  return data
                    .filter((d) => d[category] !== null)
                    .map((d) => {
                      const cx = (xScale(d[index]) || 0) + xScale.bandwidth() / 2
                      const cy = yScale(Number(d[category])) || 0

                      return (
                        <circle
                          key={`circle-${category}-${d[index]}`}
                          cx={cx}
                          cy={cy}
                          r={4}
                          fill="white"
                          stroke={colorScale(category)}
                          strokeWidth={2}
                          onMouseLeave={() => hideTooltip()}
                          onMouseMove={(event) => {
                            const point = localPoint(event) || { x: 0, y: 0 }
                            showTooltip({
                              tooltipData: { ...d, category },
                              tooltipTop: point.y,
                              tooltipLeft: point.x,
                            })
                          }}
                        />
                      )
                    })
                })}
              </Group>
            </svg>
            {tooltipOpen && tooltipData && (
              <TooltipInPortal top={tooltipTop} left={tooltipLeft} style={tooltipStyles}>
                <div className="font-medium mb-1">{tooltipData[index]}</div>
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center">
                    <div
                      className="w-3 h-3 rounded-full mr-2"
                      style={{ backgroundColor: colorScale(tooltipData.category) }}
                    />
                    <span>{tooltipData.category}:</span>
                  </div>
                  <span className="font-medium">{formatValue(Number(tooltipData[tooltipData.category]))}</span>
                </div>
              </TooltipInPortal>
            )}
            <div
              style={{
                position: "absolute",
                top: margin.top / 2,
                right: margin.right,
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                fontSize: "12px",
              }}
            >
              <LegendOrdinal
                scale={colorScale}
                direction="row"
                labelMargin="0 15px 0 0"
                shape="circle"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: "12px",
                  color: "rgba(255, 255, 255, 0.7)",
                }}
              />
            </div>
          </div>
        )
      }}
    </ParentSize>
  )
}

// Pie Chart
export function PieChart({
  data,
  index,
  category,
  colors,
  valueFormatter,
  className,
}: {
  data: any[]
  index: string
  category: string
  colors: string[]
  valueFormatter?: (value: number) => string
  className?: string
}) {
  const tooltipStyles = {
    ...defaultStyles,
    backgroundColor: "rgba(15, 15, 25, 0.9)",
    border: "1px solid rgba(168, 85, 247, 0.2)",
    color: "white",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
    borderRadius: "6px",
    padding: "8px 12px",
    fontSize: "12px",
  }

  const { tooltipOpen, tooltipLeft, tooltipTop, tooltipData, hideTooltip, showTooltip } = useTooltip<any>()

  const { containerRef, TooltipInPortal } = useTooltipInPortal({
    scroll: true,
    detectBounds: true,
  })

  const formatValue = valueFormatter || ((value: number) => `${value}`)

  return (
    <ParentSize className={className || "h-full w-full"}>
      {({ width, height }) => {
        // Bounds
        const margin = { top: 20, right: 20, bottom: 20, left: 20 }
        const innerWidth = width - margin.left - margin.right
        const innerHeight = height - margin.top - margin.bottom
        const radius = Math.min(innerWidth, innerHeight) / 2
        const centerX = innerWidth / 2
        const centerY = innerHeight / 2

        // Scales
        const colorScale = scaleOrdinal<string, string>({
          domain: data.map((d) => d[index]),
          range: colors,
        })

        // Calculate total for percentage
        const total = data.reduce((acc, d) => acc + Number(d[category]), 0)

        return (
          <div ref={containerRef} className="relative h-full w-full">
            <svg width={width} height={height}>
              <Group top={centerY + margin.top} left={centerX + margin.left}>
                <Pie
                  data={data}
                  pieValue={(d) => Number(d[category])}
                  outerRadius={radius}
                  innerRadius={radius / 2}
                  cornerRadius={3}
                  padAngle={0.02}
                >
                  {(pie) => {
                    return pie.arcs.map((arc, i) => {
                      const [centroidX, centroidY] = pie.path.centroid(arc)
                      const percentage = ((arc.data[category] / total) * 100).toFixed(1)
                      const hasSpaceForLabel = arc.endAngle - arc.startAngle >= 0.1

                      return (
                        <g
                          key={`arc-${i}`}
                          onMouseLeave={() => hideTooltip()}
                          onMouseMove={(event) => {
                            const point = localPoint(event) || { x: 0, y: 0 }
                            showTooltip({
                              tooltipData: arc.data,
                              tooltipTop: point.y,
                              tooltipLeft: point.x,
                            })
                          }}
                        >
                          <path
                            d={pie.path(arc) || ""}
                            fill={colorScale(arc.data[index])}
                            stroke="rgba(255, 255, 255, 0.1)"
                            strokeWidth={1}
                          />
                          {hasSpaceForLabel && (
                            <Text
                              x={centroidX}
                              y={centroidY}
                              textAnchor="middle"
                              verticalAnchor="middle"
                              fill="white"
                              fontSize={12}
                              fontWeight="bold"
                            >
                              {percentage}%
                            </Text>
                          )}
                        </g>
                      )
                    })
                  }}
                </Pie>
              </Group>
            </svg>
            {tooltipOpen && tooltipData && (
              <TooltipInPortal top={tooltipTop} left={tooltipLeft} style={tooltipStyles}>
                <div className="font-medium mb-1">{tooltipData[index]}</div>
                <div className="flex items-center justify-between gap-2">
                  <span>Value:</span>
                  <span className="font-medium">{formatValue(Number(tooltipData[category]))}</span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span>Percentage:</span>
                  <span className="font-medium">{((Number(tooltipData[category]) / total) * 100).toFixed(1)}%</span>
                </div>
              </TooltipInPortal>
            )}
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                flexWrap: "wrap",
                alignItems: "center",
                fontSize: "12px",
                gap: "8px",
                padding: "8px",
              }}
            >
              {data.map((d, i) => (
                <div key={i} className="flex items-center">
                  <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: colorScale(d[index]) }} />
                  <span className="text-xs text-gray-300">{d[index]}</span>
                </div>
              ))}
            </div>
          </div>
        )
      }}
    </ParentSize>
  )
}

// Donut Chart
export function DonutChart({
  data,
  index,
  category,
  colors,
  valueFormatter,
  className,
}: {
  data: any[]
  index: string
  category: string
  colors: string[]
  valueFormatter?: (value: number) => string
  className?: string
}) {
  // Reuse PieChart with different innerRadius
  return (
    <PieChart
      data={data}
      index={index}
      category={category}
      colors={colors}
      valueFormatter={valueFormatter}
      className={className}
    />
  )
}

