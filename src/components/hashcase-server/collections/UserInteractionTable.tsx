"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { TextField, Paper, Chip } from "@mui/material";
import { BACKEND_URL_HS } from "@/utils/constants";
import DisplayTable, { ColumnDef } from "../../common/DisplayTable";

interface UserInteraction {
  rank: number;
  id: number;
  username: string;
  email: string;
  wallet_address: string;
  nfts_minted: number;
  tasks_completed: number;
  quests_completed: number;
  current_streak: number;
  longest_streak: number;
  streak_freezes: number;
  total_loyalty_points: number;
  loyalty_points_earned: number;
  loyalty_points_claimed: number;
  first_interaction: Date;
  last_interaction: Date;
  total_interactions: number;
}

interface UserAnalyticsResponse {
  collection_id: number;
  total_unique_users: number;
  top_5_users: UserInteraction[];
  all_users: UserInteraction[];
}

interface UserInteractionTableProps {
  collectionId: number;
}

export default function UserInteractionTable({
  collectionId,
}: UserInteractionTableProps) {
  const [users, setUsers] = useState<UserInteraction[]>([]);
  const [totalUsers, setTotalUsers] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination (client-side)
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Search filter state
  const [searchQuery, setSearchQuery] = useState<string>("");

  const fetchUserAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get<UserAnalyticsResponse>(
        `${BACKEND_URL_HS}/hashcase-analytics/table/collection/${collectionId}/users`
      );

      setUsers(response.data.all_users);
      setTotalUsers(response.data.total_unique_users);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching user analytics:", err);
      setError("Failed to load user analytics data");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserAnalytics();
  }, [collectionId]);

  const truncateText = (
    text: string | number | null | undefined,
    maxLength: number = 12
  ) => {
    if (!text) return "";
    const textStr = String(text);
    if (textStr.length <= maxLength) return textStr;
    return `${textStr.slice(0, 6)}...${textStr.slice(-4)}`;
  };

  const formatTimestamp = (timestamp: Date) => {
    return new Date(timestamp).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const columns: ColumnDef<UserInteraction>[] = [
    {
      id: "rank",
      label: "Rank",
      align: "center",
      render: (user) => (
        <span className="font-semibold">#{user.rank}</span>
      ),
    },
    {
      id: "username",
      label: "Username",
      render: (user) => (
        <span className="font-medium">{user.username}</span>
      ),
    },
    {
      id: "wallet_address",
      label: "Wallet",
      render: (user) => (
        <span className="font-mono text-sm">
          {truncateText(user.wallet_address, 16)}
        </span>
      ),
    },
    {
      id: "nfts_minted",
      label: "NFTs Minted",
      align: "center",
      render: (user) => (
        <Chip
          label={user.nfts_minted}
          size="small"
          sx={{
            bgcolor: "#2563eb",
            color: "#fff",
            fontWeight: 600,
          }}
        />
      ),
    },
    {
      id: "tasks_completed",
      label: "Tasks",
      align: "center",
      render: (user) => user.tasks_completed,
    },
    {
      id: "quests_completed",
      label: "Quests",
      align: "center",
      render: (user) => user.quests_completed,
    },
    {
      id: "current_streak",
      label: "Streak",
      align: "center",
      render: (user) => (
        <div className="flex flex-col gap-1 text-xs">
          <div className="font-semibold text-orange-400">
            Current: {user.current_streak}
          </div>
          <div className="text-red-400">
            Longest: {user.longest_streak}
          </div>
          <div className="text-blue-400">
            Freezes: {user.streak_freezes}
          </div>
        </div>
      ),
    },
    {
      id: "loyalty_points",
      label: "Loyalty Points",
      align: "center",
      render: (user) => (
        <div className="flex flex-col gap-1 text-xs">
          <div className="font-semibold text-yellow-400">
            Total: {user.total_loyalty_points.toLocaleString()}
          </div>
          <div className="text-green-400">
            Earned: {user.loyalty_points_earned.toLocaleString()}
          </div>
          <div className="text-purple-400">
            Claimed: {user.loyalty_points_claimed.toLocaleString()}
          </div>
        </div>
      ),
    },
    {
      id: "first_interaction",
      label: "First Interaction",
      render: (user) => (
        <span className="text-sm">{formatTimestamp(user.first_interaction)}</span>
      ),
    },
    {
      id: "last_interaction",
      label: "Last Interaction",
      render: (user) => (
        <span className="text-sm">{formatTimestamp(user.last_interaction)}</span>
      ),
    },
    {
      id: "total_interactions",
      label: "Total Interactions",
      align: "center",
      render: (user) => (
        <Chip
          label={user.total_interactions}
          size="small"
          sx={{
            bgcolor: "#16a34a",
            color: "#fff",
            fontWeight: 600,
          }}
        />
      ),
    },
  ];

  // Search handler
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setPage(0); // Reset to first page when filtering
  };

  // Filter users by username or wallet address (case-insensitive)
  const filteredUsers = users.filter(
    (user) =>
      user.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.wallet_address?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Client-side pagination on filtered results
  const paginatedUsers = filteredUsers.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <div className="pb-10">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">User Interactions</h2>
        <div className="text-sm text-gray-400">
          Total Unique Users: {totalUsers.toLocaleString()}
        </div>
      </div>

      <Paper sx={{ p: 2, mb: 3, bgcolor: "#1a1a1a" }}>
        <TextField
          label="Search Users"
          placeholder="Search by username or wallet address..."
          value={searchQuery}
          onChange={handleSearchChange}
          size="small"
          fullWidth
          sx={{
            "& .MuiInputLabel-root": {
              color: "rgba(255, 255, 255, 0.7)",
            },
            "& .MuiOutlinedInput-root": {
              color: "#fff",
              "& fieldset": {
                borderColor: "rgba(255, 255, 255, 0.23)",
              },
              "&:hover fieldset": {
                borderColor: "rgba(255, 255, 255, 0.4)",
              },
            },
          }}
        />
      </Paper>

      <DisplayTable
        columns={columns}
        data={paginatedUsers}
        loading={loading}
        error={error}
        keyExtractor={(user) => user.id.toString()}
        page={page}
        rowsPerPage={rowsPerPage}
        totalCount={filteredUsers.length}
        onPageChange={(newPage) => setPage(newPage)}
        onRowsPerPageChange={(newRowsPerPage) => {
          setRowsPerPage(newRowsPerPage);
          setPage(0);
        }}
        emptyMessage="No user interactions found"
      />
    </div>
  );
}
