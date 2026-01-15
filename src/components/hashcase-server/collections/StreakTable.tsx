"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { BACKEND_URL_HS } from "@/utils/constants";
import DisplayTable, { ColumnDef } from "../../common/DisplayTable";

interface StreakData {
  id: number;
  user_id: number;
  current_streak: number;
  longest_streak: number;
  streak_freezes: number;
  last_session_date: string;
  user: {
    id: number;
    username: string;
    email: string;
    sui_wallet_address: string;
    eth_wallet_address: string;
  };
}

interface StreakTableProps {
  collectionId: string;
}

export default function StreakTable({ collectionId }: StreakTableProps) {
  const [streakData, setStreakData] = useState<StreakData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const fetchStreakData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get<StreakData[]>(
        `${BACKEND_URL_HS}/hashcase-analytics/table/users/${collectionId}/streak`
      );

      // Sort by current_streak descending
      const sortedData = response.data.sort(
        (a, b) => b.current_streak - a.current_streak
      );

      setStreakData(sortedData);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching streak data:", err);
      setError("Failed to load streak data");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStreakData();
  }, [collectionId]);

  const truncateAddress = (address: string | null | undefined) => {
    if (!address) return "N/A";
    if (address.length <= 12) return address;
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const columns: ColumnDef<StreakData>[] = [
    {
      id: "current_streak",
      label: "Current Streak",
      align: "center",
      render: (row) => (
        <span className="font-semibold text-blue-400">{row.current_streak}</span>
      ),
    },
    {
      id: "longest_streak",
      label: "Longest Streak",
      align: "center",
      render: (row) => (
        <span className="font-semibold text-green-400">{row.longest_streak}</span>
      ),
    },
    {
      id: "streak_freezes",
      label: "Streak Freezes",
      align: "center",
      render: (row) => (
        <span className="font-semibold text-purple-400">{row.streak_freezes}</span>
      ),
    },
    {
      id: "last_session_date",
      label: "Last Session Date",
      render: (row) => (
        <span className="text-sm">{formatDate(row.last_session_date)}</span>
      ),
    },
    {
      id: "sui_wallet_address",
      label: "SUI Wallet",
      render: (row) => (
        <span className="font-mono text-sm">
          {truncateAddress(row.user.sui_wallet_address)}
        </span>
      ),
    },
    {
      id: "eth_wallet_address",
      label: "ETH Wallet",
      render: (row) => (
        <span className="font-mono text-sm">
          {truncateAddress(row.user.eth_wallet_address)}
        </span>
      ),
    },
  ];

  const paginatedData = streakData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <div className="pb-10">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">User Streak Data</h2>
        <div className="text-sm text-gray-400">
          Total Users: {streakData.length}
        </div>
      </div>

      <DisplayTable
        columns={columns}
        data={paginatedData}
        loading={loading}
        error={error}
        keyExtractor={(row) => row.id.toString()}
        page={page}
        rowsPerPage={rowsPerPage}
        totalCount={streakData.length}
        onPageChange={(newPage) => setPage(newPage)}
        onRowsPerPageChange={(newRowsPerPage) => {
          setRowsPerPage(newRowsPerPage);
          setPage(0);
        }}
        emptyMessage="No streak data found"
      />
    </div>
  );
}
