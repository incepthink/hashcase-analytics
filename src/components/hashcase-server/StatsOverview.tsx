"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { BACKEND_URL_HS } from "@/utils/constants";
import { Paper, CircularProgress, Box } from "@mui/material";

interface OverviewStats {
  totalUsers: number;
  totalMints: number;
  totalQuestCompletions: number;
  usersToday: number;
  mintsToday: number;
  questCompletionsToday: number;
}

export default function StatsOverview() {
  const [stats, setStats] = useState<OverviewStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get<OverviewStats>(
        `${BACKEND_URL_HS}/hashcase-analytics/stats/overview`
      );

      setStats(response.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching overview stats:", err);
      setError("Failed to load overview statistics");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("en-US").format(num);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Paper sx={{ p: 3, bgcolor: "#1a1a1a" }}>
        <p className="text-red-500">{error}</p>
      </Paper>
    );
  }

  if (!stats) {
    return null;
  }

  const StatCard = ({
    title,
    value,
    todayValue,
    color,
  }: {
    title: string;
    value: number;
    todayValue: number;
    color: string;
  }) => (
    <Paper
      sx={{
        p: 3,
        bgcolor: "#1a1a1a",
        borderTop: `4px solid ${color}`,
        transition: "transform 0.2s",
        "&:hover": {
          transform: "translateY(-4px)",
        },
      }}
    >
      <div className="flex flex-col gap-2">
        <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wide">
          {title}
        </h3>
        <div className="flex items-baseline gap-3">
          <span className="text-3xl font-bold" style={{ color }}>
            {formatNumber(value)}
          </span>
          <span className="text-sm text-gray-500">total</span>
        </div>
        <div className="flex items-baseline gap-2 mt-1">
          <span className="text-lg font-semibold text-white">
            +{formatNumber(todayValue)}
          </span>
          <span className="text-xs text-gray-500">today</span>
        </div>
      </div>
    </Paper>
  );

  return (
    <div className="pb-10">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold">Overview Statistics</h2>
        <p className="text-sm text-gray-400 mt-1">
          Real-time analytics dashboard
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Users"
          value={stats.totalUsers}
          todayValue={stats.usersToday}
          color="#3b82f6"
        />
        <StatCard
          title="NFT Mints"
          value={stats.totalMints}
          todayValue={stats.mintsToday}
          color="#8b5cf6"
        />
        <StatCard
          title="Quest Completions"
          value={stats.totalQuestCompletions}
          todayValue={stats.questCompletionsToday}
          color="#10b981"
        />
      </div>
    </div>
  );
}
