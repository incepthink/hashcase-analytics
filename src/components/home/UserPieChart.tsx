"use client";

import CommonPieChart, { PieDataItem } from "../common/PieChart";
import { useUserChartData } from "@/hooks/useUserChartData";

export default function UserPieChart() {
  const { chartDatasets, loading, error } = useUserChartData();

  // Transform chart datasets into pie chart data using the final (latest) value
  const pieChartData: PieDataItem[] = chartDatasets.map((dataset) => {
    const finalValue =
      dataset.data.length > 0
        ? dataset.data[dataset.data.length - 1].totalUsers
        : 0;

    return {
      name: dataset.label,
      value: finalValue,
      color: dataset.color,
      balance: finalValue,
      symbol: "Users",
    };
  });

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Users Distribution</h2>
      {loading && <p className="text-gray-500">Loading chart...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && !error && (
        <div style={{ width: "100%" }}>
          <CommonPieChart
            data={pieChartData}
            isLoading={loading}
            centerLabel="Total Users"
            valuePrefix=""
          />
        </div>
      )}
    </div>
  );
}
