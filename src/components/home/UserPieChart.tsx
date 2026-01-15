"use client";

import CommonPieChart, { PieDataItem } from "../common/PieChart";
import { useCollectionsUsers } from "@/hooks/useCollectionsUsers";

// Generate a color palette for the collections
const generateColor = (index: number, total: number): string => {
  const hue = (index * 360) / total;
  return `hsl(${hue}, 70%, 60%)`;
};

export default function UserPieChart() {
  const { collections, loading, error } = useCollectionsUsers();

  // Sort collections by total_users in descending order
  const sortedCollections = [...collections].sort((a, b) => b.total_users - a.total_users);

  // Transform collections into pie chart data
  const pieChartData: PieDataItem[] = sortedCollections.map((collection, index) => {
    return {
      name: collection.name,
      value: collection.total_users,
      color: generateColor(index, sortedCollections.length),
      balance: collection.total_users,
      symbol: "Users",
    };
  });

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Users Distribution by Collection</h2>
      {loading && <p className="text-gray-500">Loading chart...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && !error && (
        <div style={{ width: "100%" }}>
          <CommonPieChart
            data={pieChartData}
            isLoading={loading}
            centerLabel="Total Users"
            valuePrefix=""
            chartId="collection-users"
          />
        </div>
      )}
    </div>
  );
}
