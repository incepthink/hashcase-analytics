"use client";

import CommonPieChart, { PieDataItem } from "../common/PieChart";
import { useEffect, useState } from "react";
import axios from "axios";
import { BACKEND_URL_AT, BACKEND_URL_HS } from "@/utils/constants";

interface ProjectUserData {
  aggtrade: number;
  hashcase: number;
  dieselDex: number;
  psycho: number;
}

export default function UserProjectPieChart() {
  const [projectData, setProjectData] = useState<ProjectUserData>({
    aggtrade: 0,
    hashcase: 0,
    dieselDex: 0,
    psycho: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch data from all APIs in parallel
        const [responseAT, responseHS, responseDiesel, responsePsycho] = await Promise.all([
          axios.get(`${BACKEND_URL_AT}/hashcase-analytics/chart/users`),
          axios.get(`${BACKEND_URL_HS}/hashcase-analytics/chart/users`),
          axios.get(`${BACKEND_URL_HS}/hashcase-analytics/table/fuel-users?page=1&limit=1`),
          axios.get(`${BACKEND_URL_HS}/hashcase-analytics/table/psycho-users?page=1&limit=1`),
        ]);

        // Get the latest user count from each API
        const aggtradeData = responseAT.data;
        const hashcaseData = responseHS.data;

        const aggtradeUsers =
          aggtradeData.length > 0
            ? aggtradeData[aggtradeData.length - 1].totalUsers
            : 0;
        const hashcaseUsers =
          hashcaseData.length > 0
            ? hashcaseData[hashcaseData.length - 1].totalUsers
            : 0;
        const dieselDexUsers = responseDiesel.data.overview?.total || 0;
        const psychoUsers = responsePsycho.data.overview?.total || 0;

        setProjectData({
          aggtrade: aggtradeUsers,
          hashcase: hashcaseUsers,
          dieselDex: dieselDexUsers,
          psycho: psychoUsers,
        });
        setLoading(false);
      } catch (err) {
        console.error("Error fetching project user data:", err);
        setError("Failed to load project data");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Transform project data into pie chart data
  const pieChartData: PieDataItem[] = [
    {
      name: "Aggtrade",
      value: projectData.aggtrade,
      color: "#00FFE9",
      balance: projectData.aggtrade,
      symbol: "Users",
    },
    {
      name: "Hashcase-Server",
      value: projectData.hashcase,
      color: "#3B82F6",
      balance: projectData.hashcase,
      symbol: "Users",
    },
    {
      name: "Diesel Dex",
      value: projectData.dieselDex,
      color: "#22C55E",
      balance: projectData.dieselDex,
      symbol: "Users",
    },
    {
      name: "Psycho",
      value: projectData.psycho,
      color: "#FF6B6B",
      balance: projectData.psycho,
      symbol: "Users",
    },
  ];

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">
        User Distribution by Project
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
            chartId="project-users"
          />
        </div>
      )}
    </div>
  );
}
