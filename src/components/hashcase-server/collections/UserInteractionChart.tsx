"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { BACKEND_URL_HS } from "@/utils/constants";
import GrowthChart from "../../common/GrowthChart";

interface InteractionData {
  date: string;
  taskCompletions: number;
  nftMints: number;
  loyaltyPointsEarned: number;
}

interface InteractionResponse {
  data: InteractionData[];
  summary: {
    totalTaskCompletions: number;
    totalNftMints: number;
    totalQuestIds: number;
    totalTaskIds: number;
  };
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

interface UserInteractionChartProps {
  collectionId: number;
}

export default function UserInteractionChart({
  collectionId,
}: UserInteractionChartProps) {
  const [rawData, setRawData] = useState<InteractionData[]>([]);
  const [chartDatasets, setChartDatasets] = useState<ChartDataset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInteractionData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await axios.get<InteractionResponse>(
          `${BACKEND_URL_HS}/hashcase-analytics/chart/collection/${collectionId}/interactions`
        );

        setRawData(response.data.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching interaction data:", err);
        setError("Failed to load interaction data");
        setLoading(false);
      }
    };

    fetchInteractionData();
  }, [collectionId]);

  // Transform data for chart
  useEffect(() => {
    if (rawData.length === 0) return;

    // Create datasets for each metric
    const taskCompletionsData: ChartDataPoint[] = rawData.map((item) => ({
      date: item.date,
      totalUsers: item.taskCompletions,
    }));

    const nftMintsData: ChartDataPoint[] = rawData.map((item) => ({
      date: item.date,
      totalUsers: item.nftMints,
    }));

    const loyaltyPointsData: ChartDataPoint[] = rawData.map((item) => ({
      date: item.date,
      totalUsers: item.loyaltyPointsEarned,
    }));

    setChartDatasets([
      {
        data: taskCompletionsData,
        color: "#8b5cf6",
        label: "Task Completions",
      },
      {
        data: nftMintsData,
        color: "#3b82f6",
        label: "NFT Mints",
      },
      {
        data: loyaltyPointsData,
        color: "#eab308",
        label: "Loyalty Points Earned",
      },
    ]);
  }, [rawData]);

  if (loading) {
    return (
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">User Interaction Trends</h2>
        <p className="text-gray-500">Loading chart...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">User Interaction Trends</h2>
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (rawData.length === 0) {
    return (
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">User Interaction Trends</h2>
        <p className="text-gray-400">No interaction data available</p>
      </div>
    );
  }

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">User Interaction Trends</h2>
      </div>
      <div style={{ height: "400px", width: "100%" }}>
        <GrowthChart chartDatasets={chartDatasets} />
      </div>
      <div className="flex items-center justify-center gap-6 mt-4 text-sm">
        <div className="flex items-center gap-2">
          <div
            className="w-4 h-4 rounded"
            style={{ backgroundColor: "#8b5cf6" }}
          ></div>
          <span className="text-gray-300">Task Completions</span>
        </div>
        <div className="flex items-center gap-2">
          <div
            className="w-4 h-4 rounded"
            style={{ backgroundColor: "#3b82f6" }}
          ></div>
          <span className="text-gray-300">NFT Mints</span>
        </div>
        <div className="flex items-center gap-2">
          <div
            className="w-4 h-4 rounded"
            style={{ backgroundColor: "#eab308" }}
          ></div>
          <span className="text-gray-300">Loyalty Points Earned</span>
        </div>
      </div>
    </div>
  );
}
