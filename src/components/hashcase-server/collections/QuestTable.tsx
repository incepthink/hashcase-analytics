"use client";

import { useState } from "react";
import { Chip, Collapse, IconButton } from "@mui/material";
import DisplayTable, { ColumnDef } from "../../common/DisplayTable";
import { Quest } from "@/types/quest";

interface QuestTableProps {
  quests: Quest[];
}

export default function QuestTable({ quests }: QuestTableProps) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const toggleRowExpansion = (questId: number) => {
    setExpandedRows((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(questId)) {
        newSet.delete(questId);
      } else {
        newSet.add(questId);
      }
      return newSet;
    });
  };

  const columns: ColumnDef<Quest>[] = [
    {
      id: "expand",
      label: "",
      align: "center",
      render: (quest) => (
        <IconButton
          size="small"
          onClick={() => toggleRowExpansion(quest.id)}
          sx={{ color: "#00FFE9" }}
        >
          {expandedRows.has(quest.id) ? "▼" : "▶"}
        </IconButton>
      ),
    },
    {
      id: "id",
      label: "Quest ID",
      align: "center",
      render: (quest) => quest.id,
    },
    {
      id: "title",
      label: "Title",
      render: (quest) => (
        <div className="max-w-xs">
          <div className="font-semibold">{quest.title}</div>
          <div className="text-xs text-gray-400 truncate">
            {quest.description}
          </div>
        </div>
      ),
    },
    {
      id: "is_active",
      label: "Status",
      align: "center",
      render: (quest) =>
        quest.is_active ? (
          <Chip
            label="Active"
            size="small"
            sx={{ bgcolor: "#10B981", color: "#fff" }}
          />
        ) : (
          <Chip
            label="Inactive"
            size="small"
            sx={{ bgcolor: "#6B7280", color: "#fff" }}
          />
        ),
    },
    {
      id: "unique_users_interacted",
      label: "Interactions",
      align: "center",
      render: (quest) => (
        <span className="font-semibold text-cyan-400">
          {quest.unique_users_interacted}
        </span>
      ),
    },
    {
      id: "users_completed_quest",
      label: "Completed",
      align: "center",
      render: (quest) => quest.users_completed_quest,
    },
    {
      id: "total_task_completions",
      label: "Task Completions",
      align: "center",
      render: (quest) => quest.total_task_completions,
    },
    {
      id: "rewards_claimed",
      label: "Rewards Claimed",
      align: "center",
      render: (quest) => quest.rewards_claimed,
    },
    {
      id: "created_at",
      label: "Created",
      render: (quest) => formatTimestamp(quest.created_at),
    },
  ];

  // Client-side pagination
  const paginatedQuests = quests.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <div className="pb-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-semibold">All Quests</h3>
          <p className="text-sm text-gray-400 mt-1">
            Complete quest analytics for this collection
          </p>
        </div>
        <div className="text-sm text-gray-400">
          Total Quests: {quests.length}
        </div>
      </div>

      <DisplayTable
        columns={columns}
        data={paginatedQuests}
        loading={false}
        error={null}
        keyExtractor={(quest) => quest.id.toString()}
        page={page}
        rowsPerPage={rowsPerPage}
        totalCount={quests.length}
        onPageChange={(newPage) => setPage(newPage)}
        onRowsPerPageChange={(newRowsPerPage) => {
          setRowsPerPage(newRowsPerPage);
          setPage(0);
        }}
        emptyMessage="No quests found"
        expandableRow={(quest) => (
          <Collapse in={expandedRows.has(quest.id)} timeout="auto" unmountOnExit>
            <div className="p-4 bg-gray-900/50">
              <h4 className="text-sm font-semibold mb-3 text-cyan-400">
                Quest Tasks ({quest.tasks.length})
              </h4>
              {quest.tasks.length > 0 ? (
                <div className="space-y-2">
                  {quest.tasks.map((task, index) => (
                    <div
                      key={task.id}
                      className="bg-gray-800/50 p-3 rounded border border-gray-700"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs bg-cyan-500/20 text-cyan-400 px-2 py-1 rounded">
                              Task {index + 1}
                            </span>
                            <span className="font-semibold text-sm">
                              {task.title}
                            </span>
                          </div>
                          <p className="text-xs text-gray-400 mt-1">
                            {task.description}
                          </p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3 text-xs">
                        <div>
                          <span className="text-gray-500">Code:</span>
                          <span className="ml-2 font-mono text-cyan-400">
                            {task.task_code}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">Required:</span>
                          <span className="ml-2 font-semibold">
                            {task.required_completions}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">Completions:</span>
                          <span className="ml-2 font-semibold text-green-400">
                            {task.total_completions}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">Unique Users:</span>
                          <span className="ml-2 font-semibold text-purple-400">
                            {task.unique_users_completed}
                          </span>
                        </div>
                        <div className="col-span-2">
                          <span className="text-gray-500">Loyalty Points:</span>
                          <span className="ml-2 font-semibold text-yellow-400">
                            {task.reward_loyalty_points}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No tasks available</p>
              )}
            </div>
          </Collapse>
        )}
      />
    </div>
  );
}
