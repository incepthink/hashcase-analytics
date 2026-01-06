"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { BACKEND_URL_AT } from "@/utils/constants";
import GrowthChart from "../common/GrowthChart";

interface SwapAPIData {
  date: string;
  totalSwaps: number;
  totalVolumeUSD: number;
}

interface ChartDataPoint {
  date: string;
  totalUsers: number;
}

interface ChartDataset {
  data: ChartDataPoint[];
  color: string;
  label: string;
}

type ViewMode = "swaps" | "volume";

export default function SwapChart() {
  const [rawData, setRawData] = useState<SwapAPIData[]>([]);
  const [chartDatasets, setChartDatasets] = useState<ChartDataset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("swaps");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch data from AT API only
        const responseAT = await axios.get<SwapAPIData[]>(
          `${BACKEND_URL_AT}/hashcase-analytics/chart/sushiswap`
        );

        setRawData(responseAT.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching swap chart data:", err);
        setError("Failed to load chart data");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Transform data based on view mode
  useEffect(() => {
    if (rawData.length === 0) return;

    const transformedData: ChartDataPoint[] = rawData.map((item) => ({
      date: item.date,
      totalUsers: viewMode === "swaps" ? item.totalSwaps : item.totalVolumeUSD,
    }));

    setChartDatasets([
      {
        data: transformedData,
        color: viewMode === "swaps" ? "#00FFE9" : "#22c55e",
        label: viewMode === "swaps" ? "Total Swaps" : "Volume (USD)",
      },
    ]);
  }, [rawData, viewMode]);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">Swaps/Volume</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode("swaps")}
            className={`px-4 py-2 rounded-lg transition-colors ${
              viewMode === "swaps"
                ? "bg-[#00FFE9] text-black font-semibold"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            Swaps
          </button>
          <button
            onClick={() => setViewMode("volume")}
            className={`px-4 py-2 rounded-lg transition-colors ${
              viewMode === "volume"
                ? "bg-[#22c55e] text-black font-semibold"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            Volume
          </button>
        </div>
      </div>
      {loading && <p className="text-gray-500">Loading chart...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && !error && (
        <div style={{ height: "400px", width: "100%" }}>
          <GrowthChart chartDatasets={chartDatasets} />
        </div>
      )}
    </div>
  );
}
