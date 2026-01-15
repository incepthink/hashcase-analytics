"use client";

import GrowthChart from "@/components/common/GrowthChart";
import { usePsychoTransactionsChart } from "@/hooks/useFuelData";

export default function PsychoTransactionsLineChart() {
  const { chartDatasets, loading, error } = usePsychoTransactionsChart();

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Psycho Transactions Growth</h2>
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
