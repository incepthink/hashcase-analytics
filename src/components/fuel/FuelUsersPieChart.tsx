"use client";

import CommonPieChart, { PieDataItem } from "../common/PieChart";
import { useFuelUsersPieChart } from "@/hooks/useFuelData";

const COLORS = ["#FF6B6B", "#4ECDC4"];

export default function FuelUsersPieChart() {
  const { data, loading, error } = useFuelUsersPieChart();

  const pieChartData: PieDataItem[] = data.map((item, index) => ({
    name: item.name,
    value: item.total,
    color: COLORS[index % COLORS.length],
    balance: item.total,
    symbol: "Users",
  }));

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">
        Users Distribution By Project
      </h2>
      {loading && <p className="text-gray-500">Loading chart...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && !error && (
        <div style={{ width: "100%" }}>
          <CommonPieChart
            data={pieChartData}
            isLoading={loading}
            centerLabel="Total Users"
            valuePrefix=""
            layout="list"
            chartId="fuel-users"
          />
        </div>
      )}
    </div>
  );
}
