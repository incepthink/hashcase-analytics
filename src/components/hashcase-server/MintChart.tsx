"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { BACKEND_URL_HS } from "@/utils/constants";
import GrowthChart from "../common/GrowthChart";

interface MintAPIData {
  date: string;
  totalMints: number;
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

export default function MintChart() {
  const [rawData, setRawData] = useState<MintAPIData[]>([]);
  const [chartDatasets, setChartDatasets] = useState<ChartDataset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch data from HS API
        const responseHS = await axios.get<MintAPIData[]>(
          `${BACKEND_URL_HS}/hashcase-analytics/chart/mints`
        );

        setRawData(responseHS.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching mint chart data:", err);
        setError("Failed to load chart data");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Transform data for chart
  useEffect(() => {
    if (rawData.length === 0) return;

    const transformedData: ChartDataPoint[] = rawData.map((item) => ({
      date: item.date,
      totalUsers: item.totalMints,
    }));

    setChartDatasets([
      {
        data: transformedData,
        color: "#00FFE9",
        label: "Total Mints",
      },
    ]);
  }, [rawData]);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">Mints</h2>
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
