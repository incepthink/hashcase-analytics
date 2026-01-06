"use client";

import GrowthChart from "../common/GrowthChart";
import { useUserChartData } from "@/hooks/useUserChartData";

export default function UserLineChart() {
  const { chartDatasets, loading, error } = useUserChartData();

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Users</h2>
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
