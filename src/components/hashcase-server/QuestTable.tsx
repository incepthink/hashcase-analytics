"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { BACKEND_URL_HS } from "@/utils/constants";
import { Chip } from "@mui/material";
import DisplayTable, { ColumnDef } from "../common/DisplayTable";

interface Quest {
  title: string;
  reward_token_amount: string;
}

interface Task {
  title: string;
  quest_id: number;
  quest: Quest;
}

interface QuestCompletion {
  id: number;
  task_id: number;
  user_id: string;
  completed_at: string;
  task: Task;
}

export default function QuestTable() {
  const [questCompletions, setQuestCompletions] = useState<QuestCompletion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination (client-side since API returns last 100)
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const fetchQuestCompletions = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get<QuestCompletion[]>(
        `${BACKEND_URL_HS}/hashcase-analytics/table/quest-completions`
      );

      setQuestCompletions(response.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching quest completions:", err);
      setError("Failed to load quest completions data");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestCompletions();
  }, []);

  const truncateText = (text: string | number | null | undefined, maxLength: number = 12) => {
    if (!text) return "";
    const textStr = String(text);
    if (textStr.length <= maxLength) return textStr;
    return `${textStr.slice(0, 6)}...${textStr.slice(-4)}`;
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatReward = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const columns: ColumnDef<QuestCompletion>[] = [
    {
      id: "id",
      label: "ID",
      align: "center",
      render: (completion) => completion.id,
    },
    {
      id: "user_id",
      label: "User ID",
      render: (completion) => (
        <span className="font-mono text-sm">{truncateText(completion.user_id)}</span>
      ),
    },
    {
      id: "task_title",
      label: "Task",
      render: (completion) => (
        <div className="flex flex-col gap-1">
          <span className="font-medium">{completion.task.title}</span>
          <span className="text-xs text-gray-400">
            Quest ID: {completion.task.quest_id}
          </span>
        </div>
      ),
    },
    {
      id: "quest_title",
      label: "Quest",
      render: (completion) => completion.task.quest.title,
    },
    {
      id: "reward",
      label: "Reward",
      align: "right",
      render: (completion) => (
        <Chip
          label={`${formatReward(parseFloat(completion.task.quest.reward_token_amount))} tokens`}
          size="small"
          sx={{
            bgcolor: "#10b981",
            color: "#fff",
            fontWeight: 500,
          }}
        />
      ),
    },
    {
      id: "completed_at",
      label: "Completed At",
      render: (completion) => formatTimestamp(completion.completed_at),
    },
  ];

  // Client-side pagination
  const paginatedCompletions = questCompletions.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <div className="pb-10">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">Quest Completions Table</h2>
        <div className="text-sm text-gray-400">
          Total Completions: {questCompletions.length}
        </div>
      </div>

      <DisplayTable
        columns={columns}
        data={paginatedCompletions}
        loading={loading}
        error={error}
        keyExtractor={(completion) => completion.id.toString()}
        page={page}
        rowsPerPage={rowsPerPage}
        totalCount={questCompletions.length}
        onPageChange={(newPage) => setPage(newPage)}
        onRowsPerPageChange={(newRowsPerPage) => {
          setRowsPerPage(newRowsPerPage);
          setPage(0);
        }}
        emptyMessage="No quest completions found"
      />
    </div>
  );
}
