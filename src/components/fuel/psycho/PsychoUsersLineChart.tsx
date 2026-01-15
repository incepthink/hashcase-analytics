"use client";

import GrowthChart from "@/components/common/GrowthChart";
import { usePsychoUsersChart } from "@/hooks/useFuelData";

export default function PsychoUsersLineChart() {
  const { chartDatasets, loading, error } = usePsychoUsersChart();

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Psycho Users Growth</h2>
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
