import { useEffect, useState } from "react";
import axios from "axios";
import { BACKEND_URL_AT, BACKEND_URL_HS } from "@/utils/constants";

export interface UserData {
  date: string;
  totalUsers: number;
}

export interface ChartDataset {
  data: UserData[];
  color: string;
  label: string;
}

export function useUserChartData() {
  const [chartDatasets, setChartDatasets] = useState<ChartDataset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch data from both APIs in parallel
        const [responseAT, responseHS] = await Promise.all([
          axios.get<UserData[]>(
            `${BACKEND_URL_AT}/hashcase-analytics/chart/users`
          ),
          axios.get<UserData[]>(
            `${BACKEND_URL_HS}/hashcase-analytics/chart/users`
          ),
        ]);

        setChartDatasets([
          {
            data: responseAT.data,
            color: "#00FFE9",
            label: "Aggtrade",
          },
          {
            data: responseHS.data,
            color: "#3B82F6",
            label: "Hashcase",
          },
        ]);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching user chart data:", err);
        setError("Failed to load chart data");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { chartDatasets, loading, error };
}
