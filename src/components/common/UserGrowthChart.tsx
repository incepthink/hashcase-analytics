import React, { useEffect, useRef } from "react";
import {
  createChart,
  IChartApi,
  ISeriesApi,
  LineData,
  Time,
} from "lightweight-charts";

interface UserGrowthDataPoint {
  date: string;
  totalUsers: number;
}

interface ChartDataset {
  data: UserGrowthDataPoint[];
  color: string;
  label: string;
}

interface UserGrowthChartProps {
  chartDatasets: ChartDataset[];
}

export default function UserGrowthChart({ chartDatasets }: UserGrowthChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRefs = useRef<ISeriesApi<"Area">[]>([]);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);

  // Initialize chart
  useEffect(() => {
    if (!chartContainerRef.current) return;

    const container = chartContainerRef.current;
    const rect = container.getBoundingClientRect();

    console.log("Initializing user growth chart with dimensions:", rect);

    const chart = createChart(container, {
      layout: {
        background: { color: "transparent" },
        textColor: "#fff",
        fontFamily: "system-ui, -apple-system, sans-serif",
      },
      grid: {
        vertLines: {
          color: "#ffffff10",
          style: 1,
          visible: true,
        },
        horzLines: {
          color: "#ffffff10",
          style: 1,
          visible: true,
        },
      },
      width: Math.floor(rect.width),
      height: Math.floor(rect.height),
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
        borderColor: "#ffffff20",
        fixLeftEdge: true,
        fixRightEdge: true,
        lockVisibleTimeRangeOnResize: true,
      },
      rightPriceScale: {
        borderColor: "#ffffff20",
        textColor: "#fff",
        autoScale: true,
        scaleMargins: {
          top: 0.15,
          bottom: 0.15,
        },
      },
      crosshair: {
        vertLine: {
          color: "#22c55e",
          width: 1,
          style: 0,
          labelBackgroundColor: "#22c55e",
        },
        horzLine: {
          color: "#22c55e",
          width: 1,
          style: 0,
          labelBackgroundColor: "#22c55e",
        },
      },
      handleScroll: {
        mouseWheel: true,
        pressedMouseMove: true,
        horzTouchDrag: true,
        vertTouchDrag: true,
      },
      handleScale: {
        axisPressedMouseMove: {
          time: true,
          price: true,
        },
        mouseWheel: true,
        pinch: true,
      },
    });

    chartRef.current = chart;
    seriesRefs.current = [];

    if (window.ResizeObserver) {
      resizeObserverRef.current = new ResizeObserver((entries) => {
        if (!entries.length || !chartRef.current) return;

        const { width, height } = entries[0].contentRect;
        chartRef.current.applyOptions({
          width: Math.floor(width),
          height: Math.floor(height),
        });
      });

      resizeObserverRef.current.observe(container);
    }

    return () => {
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
      }
      if (chartRef.current) {
        chartRef.current.remove();
      }
    };
  }, []);

  // Update chart data
  useEffect(() => {
    if (!chartRef.current || chartDatasets.length === 0) {
      console.log("Cannot update chart:", {
        hasChart: !!chartRef.current,
        datasetsLength: chartDatasets.length,
      });
      return;
    }

    try {
      // Clear existing series
      seriesRefs.current.forEach((series) => {
        chartRef.current?.removeSeries(series);
      });
      seriesRefs.current = [];

      // Create a series for each dataset
      chartDatasets.forEach((dataset) => {
        // Convert hex color to rgba for gradient
        const hexToRgba = (hex: string, alpha: number) => {
          const r = parseInt(hex.slice(1, 3), 16);
          const g = parseInt(hex.slice(3, 5), 16);
          const b = parseInt(hex.slice(5, 7), 16);
          return `rgba(${r}, ${g}, ${b}, ${alpha})`;
        };

        const series = chartRef.current!.addAreaSeries({
          lineColor: dataset.color,
          topColor: hexToRgba(dataset.color, 0.4),
          bottomColor: hexToRgba(dataset.color, 0.05),
          lineWidth: 2,
          priceFormat: {
            type: "price",
            precision: 0,
            minMove: 1,
          },
        });

        // Convert date strings to timestamps
        const convertedData = dataset.data.map((point) => ({
          time: (new Date(point.date).getTime() / 1000) as Time,
          value: point.totalUsers,
        }));

        // Sort data
        const sortedData = [...convertedData].sort(
          (a, b) => (a.time as number) - (b.time as number)
        );

        // Remove duplicates
        const uniqueData: LineData<Time>[] = [];
        let lastTime = -1;

        for (const point of sortedData) {
          if (point.time !== lastTime) {
            uniqueData.push(point);
            lastTime = point.time as number;
          }
        }

        console.log(`Setting chart data for ${dataset.label}:`, {
          originalCount: dataset.data.length,
          sortedCount: sortedData.length,
          uniqueCount: uniqueData.length,
          firstPoint: uniqueData[0],
          lastPoint: uniqueData[uniqueData.length - 1],
        });

        series.setData(uniqueData);
        seriesRefs.current.push(series);
      });

      // Fit content after all series are added
      if (chartRef.current) {
        setTimeout(() => {
          if (chartRef.current) {
            chartRef.current.timeScale().fitContent();
            console.log("Chart content fitted");
          }
        }, 150);
      }
    } catch (err) {
      console.error("Error updating user growth chart:", err);
    }
  }, [chartDatasets]);

  return (
    <div
      ref={chartContainerRef}
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        backgroundColor: "transparent",
      }}
    />
  );
}
