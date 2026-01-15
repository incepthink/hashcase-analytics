"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { BACKEND_URL_HS } from "@/utils/constants";
import { CircularProgress, Box, Paper } from "@mui/material";
import QuestRank from "./QuestRank";
import QuestTable from "./QuestTable";
import { QuestCollectionResponse } from "@/types/quest";

interface QuestOverviewProps {
  collectionId: string;
}

export default function QuestOverview({ collectionId }: QuestOverviewProps) {
  const [data, setData] = useState<QuestCollectionResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchQuestData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get<QuestCollectionResponse>(
        `${BACKEND_URL_HS}/hashcase-analytics/table/collection/${collectionId}/quests`
      );

      setData(response.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching Quest data:", err);
      setError("Failed to load Quest data");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestData();
  }, [collectionId]);

  // Loading state
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <CircularProgress />
      </Box>
    );
  }

  // Error state
  if (error) {
    return (
      <Paper sx={{ p: 3, bgcolor: "#1a1a1a" }}>
        <p className="text-red-500">{error}</p>
      </Paper>
    );
  }

  // No data state
  if (!data) {
    return null;
  }

  return (
    <div className="flex flex-col gap-10">
      {/* Header with collection stats */}
      <div className="mb-2">
        <h2 className="text-2xl font-semibold mb-2">Quest Overview</h2>
        <div className="flex gap-6 text-sm text-gray-400">
          <span>Total Quests: {data.all_quests.length}</span>
          <span>
            Active Quests:{" "}
            {data.all_quests.filter((q) => q.is_active).length}
          </span>
        </div>
      </div>

      {/* Top 3 Quests by interactions */}
      {data.top_3_by_interactions.length > 0 && (
        <QuestRank topQuests={data.top_3_by_interactions} />
      )}

      {/* All Quests Table */}
      {data.all_quests.length > 0 && <QuestTable quests={data.all_quests} />}
    </div>
  );
}
