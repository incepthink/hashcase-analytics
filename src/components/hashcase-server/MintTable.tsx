"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { BACKEND_URL_HS } from "@/utils/constants";
import DisplayTable, { ColumnDef } from "../common/DisplayTable";

interface NFTMint {
  id: number;
  user_id: string;
  name: string;
  collection_id: string;
  token_id: string;
  sui_object_id: string;
  createdAt: string;
}

export default function MintTable() {
  const [mints, setMints] = useState<NFTMint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination (client-side since API returns last 100)
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const fetchMints = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get<NFTMint[]>(
        `${BACKEND_URL_HS}/hashcase-analytics/table/nft-mints`
      );

      setMints(response.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching NFT mints:", err);
      setError("Failed to load NFT mints data");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMints();
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

  const columns: ColumnDef<NFTMint>[] = [
    {
      id: "id",
      label: "ID",
      align: "center",
      render: (mint) => mint.id,
    },
    {
      id: "user_id",
      label: "User ID",
      render: (mint) => (
        <span className="font-mono text-sm">{truncateText(mint.user_id)}</span>
      ),
    },
    {
      id: "name",
      label: "Name",
      render: (mint) => mint.name,
    },
    {
      id: "collection_id",
      label: "Collection ID",
      render: (mint) => (
        <span className="font-mono text-sm">{truncateText(mint.collection_id)}</span>
      ),
    },
    {
      id: "token_id",
      label: "Token ID",
      render: (mint) => (
        <span className="font-mono text-sm">{truncateText(mint.token_id)}</span>
      ),
    },
    {
      id: "sui_object_id",
      label: "Sui Object ID",
      render: (mint) => (
        <span className="font-mono text-sm">{truncateText(mint.sui_object_id)}</span>
      ),
    },
    {
      id: "createdAt",
      label: "Created At",
      render: (mint) => formatTimestamp(mint.createdAt),
    },
  ];

  // Client-side pagination
  const paginatedMints = mints.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <div className="pb-10">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">NFT Mints Table</h2>
        <div className="text-sm text-gray-400">
          Total Mints: {mints.length}
        </div>
      </div>

      <DisplayTable
        columns={columns}
        data={paginatedMints}
        loading={loading}
        error={error}
        keyExtractor={(mint) => mint.id.toString()}
        page={page}
        rowsPerPage={rowsPerPage}
        totalCount={mints.length}
        onPageChange={(newPage) => setPage(newPage)}
        onRowsPerPageChange={(newRowsPerPage) => {
          setRowsPerPage(newRowsPerPage);
          setPage(0);
        }}
        emptyMessage="No NFT mints found"
      />
    </div>
  );
}
