"use client";

import { useState } from "react";
import DisplayTable, { ColumnDef } from "../../common/DisplayTable";
import { NFTMint } from "@/types/nft";

interface NFTTableProps {
  mints: NFTMint[];
}

export default function NFTTable({ mints }: NFTTableProps) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const truncateText = (
    text: string | number | null | undefined,
    maxLength: number = 12
  ) => {
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
      label: "Mint ID",
      align: "center",
      render: (mint) => mint.id,
    },
    {
      id: "user_address",
      label: "User Address",
      render: (mint) => (
        <span className="font-mono text-sm">
          {truncateText(mint.user_address)}
        </span>
      ),
    },
    {
      id: "name",
      label: "NFT Name",
      render: (mint) => mint.name,
    },
    {
      id: "token_id",
      label: "Token ID",
      align: "center",
      render: (mint) => (
        <span className="font-mono text-sm">{mint.token_id}</span>
      ),
    },
    {
      id: "metadata_id",
      label: "Metadata ID",
      align: "center",
      render: (mint) => mint.metadata_id,
    },
    {
      id: "createdAt",
      label: "Minted At",
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
        <div>
          <h3 className="text-xl font-semibold">Mint History</h3>
          <p className="text-sm text-gray-400 mt-1">
            All mints for this collection
          </p>
        </div>
        <div className="text-sm text-gray-400">Total Mints: {mints.length}</div>
      </div>

      <DisplayTable
        columns={columns}
        data={paginatedMints}
        loading={false}
        error={null}
        keyExtractor={(mint) => mint.id.toString()}
        page={page}
        rowsPerPage={rowsPerPage}
        totalCount={mints.length}
        onPageChange={(newPage) => setPage(newPage)}
        onRowsPerPageChange={(newRowsPerPage) => {
          setRowsPerPage(newRowsPerPage);
          setPage(0);
        }}
        emptyMessage="No mints found"
      />
    </div>
  );
}
