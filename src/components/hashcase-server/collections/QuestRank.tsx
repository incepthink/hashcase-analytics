"use client";

import { Paper, Chip } from "@mui/material";
import { TopQuest } from "@/types/quest";

interface QuestRankProps {
  topQuests: TopQuest[];
}

export default function QuestRank({ topQuests }: QuestRankProps) {
  // Rank colors for visual distinction
  const rankColors: Record<1 | 2 | 3, string> = {
    1: "#FFD700", // Gold
    2: "#C0C0C0", // Silver
    3: "#CD7F32", // Bronze
  };

  return (
    <div className="pb-6">
      <div className="mb-6">
        <h3 className="text-xl font-semibold">Top Quests by Interactions</h3>
        <p className="text-sm text-gray-400 mt-1">
          Most popular quests based on unique user interactions
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {topQuests.map((quest) => (
          <RankCard
            key={quest.id}
            quest={quest}
            rankColor={rankColors[quest.rank]}
          />
        ))}
      </div>
    </div>
  );
}

interface RankCardProps {
  quest: TopQuest;
  rankColor: string;
}

function RankCard({ quest, rankColor }: RankCardProps) {
  return (
    <Paper
      sx={{
        bgcolor: "#1a1a1a",
        borderTop: `4px solid ${rankColor}`,
        overflow: "hidden",
        transition: "transform 0.2s",
        "&:hover": {
          transform: "translateY(-4px)",
        },
      }}
    >
      {/* Rank Badge */}
      <div className="relative">
        <div className="p-4">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center text-2xl font-bold mb-4"
            style={{
              backgroundColor: rankColor,
              color: "#000",
              boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
            }}
          >
            {quest.rank}
          </div>

          {/* Quest Info */}
          <div className="mb-3">
            <div className="flex items-center gap-2 mb-2">
              <h4 className="text-lg font-semibold text-white truncate">
                {quest.title}
              </h4>
              {quest.is_active ? (
                <Chip
                  label="Active"
                  size="small"
                  sx={{
                    bgcolor: "#10B981",
                    color: "#fff",
                    fontSize: "0.7rem",
                    height: "20px",
                  }}
                />
              ) : (
                <Chip
                  label="Inactive"
                  size="small"
                  sx={{
                    bgcolor: "#6B7280",
                    color: "#fff",
                    fontSize: "0.7rem",
                    height: "20px",
                  }}
                />
              )}
            </div>
            <p className="text-sm text-gray-400 line-clamp-2">
              {quest.description || "No description available"}
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-700">
            <div>
              <p className="text-xs text-gray-500">Interactions</p>
              <p className="text-lg font-bold" style={{ color: rankColor }}>
                {quest.unique_users_interacted}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Completed</p>
              <p className="text-lg font-bold text-white">
                {quest.users_completed_quest}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Task Completions</p>
              <p className="text-sm font-semibold text-cyan-400">
                {quest.total_task_completions}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Rewards Claimed</p>
              <p className="text-sm font-semibold text-cyan-400">
                {quest.rewards_claimed}
              </p>
            </div>
          </div>

          {/* Tasks Count */}
          <div className="mt-3 pt-3 border-t border-gray-700">
            <p className="text-xs text-gray-500">
              {quest.tasks.length} {quest.tasks.length === 1 ? "Task" : "Tasks"}
            </p>
          </div>
        </div>
      </div>
    </Paper>
  );
}
