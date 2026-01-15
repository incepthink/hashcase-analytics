"use client";

import GrowthChart from "../common/GrowthChart";
import { useUserChartData } from "@/hooks/useUserChartData";

export default function UserLineChart() {
  const { chartDatasets, loading, error } = useUserChartData();

  // Override Diesel Dex color to green
  const modifiedDatasets = chartDatasets.map((dataset) => {
    if (dataset.label === "Diesel Dex") {
      return { ...dataset, color: "#22c55e" };
    }
    return dataset;
  });

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Users</h2>
      {loading && <p className="text-gray-500">Loading chart...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && !error && (
        <>
          <div className="flex flex-wrap gap-4 mb-4">
            {modifiedDatasets.map((dataset) => (
              <div key={dataset.label} className="flex items-center gap-2">
                <div
                  className="w-4 h-4 rounded"
                  style={{ backgroundColor: dataset.color }}
                />
                <span className="text-sm text-gray-300">{dataset.label}</span>
              </div>
            ))}
          </div>
          <div style={{ height: "400px", width: "100%" }}>
            <GrowthChart chartDatasets={modifiedDatasets} />
          </div>
        </>
      )}
    </div>
  );
}
