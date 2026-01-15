"use client";

import GrowthChart from "@/components/common/GrowthChart";
import { useFuelUsersChart } from "@/hooks/useFuelData";

export default function DieselUsersLineChart() {
  const { chartDatasets, loading, error } = useFuelUsersChart();

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Diesel Users Growth</h2>
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
