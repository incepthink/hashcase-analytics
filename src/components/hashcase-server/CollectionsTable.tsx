"use client";

import { useState } from "react";
import { TextField, Paper } from "@mui/material";
import { useRouter } from "next/navigation";
import DisplayTable, { ColumnDef } from "../common/DisplayTable";
import { useCollections, Collection } from "@/hooks/useCollections";

export default function CollectionsTable() {
  const router = useRouter();

  // Use TanStack Query hook
  const { data: collections = [], isLoading: loading, error: queryError } = useCollections();
  const error = queryError ? "Failed to load collections data" : null;

  // Pagination (client-side since API returns last 100)
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Search filter state
  const [searchQuery, setSearchQuery] = useState<string>("");

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

  const columns: ColumnDef<Collection>[] = [
    {
      id: "id",
      label: "ID",
      align: "center",
      render: (collection) => collection.id,
    },
    {
      id: "name",
      label: "Name",
      render: (collection) => collection.name,
    },
    {
      id: "description",
      label: "Description",
      render: (collection) => (
        <span className="text-sm">
          {truncateText(collection.description, 30)}
        </span>
      ),
    },
    {
      id: "chain_name",
      label: "Chain",
      render: (collection) => (
        <span className="uppercase text-sm font-semibold">
          {collection.chain_name}
        </span>
      ),
    },
    {
      id: "owner_id",
      label: "Owner ID",
      render: (collection) => (
        <span className="font-mono text-sm">
          {truncateText(collection.owner_id)}
        </span>
      ),
    },
    {
      id: "priority",
      label: "Priority",
      align: "center",
      render: (collection) => collection.priority,
    },
    {
      id: "collection_address",
      label: "Collection Address",
      render: (collection) => (
        <span className="font-mono text-sm">
          {truncateText(collection.collection_address)}
        </span>
      ),
    },
    {
      id: "tags",
      label: "Tags",
      render: (collection) => (
        <div className="flex flex-wrap gap-1">
          {collection.tags && collection.tags.length > 0 ? (
            collection.tags.slice(0, 2).map((tag, index) => (
              <span
                key={index}
                className="px-2 py-0.5 bg-blue-500/20 text-blue-400 rounded text-xs"
              >
                {tag}
              </span>
            ))
          ) : (
            <span className="text-gray-500 text-xs">No tags</span>
          )}
          {collection.tags && collection.tags.length > 2 && (
            <span className="text-gray-400 text-xs">
              +{collection.tags.length - 2}
            </span>
          )}
        </div>
      ),
    },
    {
      id: "createdAt",
      label: "Created At",
      render: (collection) => formatTimestamp(collection.createdAt),
    },
  ];

  // Search handler
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setPage(0); // Reset to first page when filtering
  };

  // Filter collections by name (case-insensitive)
  const filteredCollections = collections.filter((collection) =>
    collection.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Client-side pagination on filtered results
  const paginatedCollections = filteredCollections.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleRowClick = (collection: Collection) => {
    // Navigate to collection detail page with just the ID
    // Data will be fetched/retrieved from TanStack Query cache
    router.push(`/hashcase-server/collections/${collection.id}`);
  };

  return (
    <div className="pb-10">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">Collections Table</h2>
        <div className="text-sm text-gray-400">
          Total Collections: {collections.length}
        </div>
      </div>

      <Paper sx={{ p: 2, mb: 3, bgcolor: "#1a1a1a" }}>
        <TextField
          label="Search Collections"
          placeholder="Search by name..."
          value={searchQuery}
          onChange={handleSearchChange}
          size="small"
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
        data={paginatedCollections}
        loading={loading}
        error={error}
        keyExtractor={(collection) => collection.id.toString()}
        page={page}
        rowsPerPage={rowsPerPage}
        totalCount={filteredCollections.length}
        onPageChange={(newPage) => setPage(newPage)}
        onRowsPerPageChange={(newRowsPerPage) => {
          setRowsPerPage(newRowsPerPage);
          setPage(0);
        }}
        emptyMessage="No collections found"
        onRowClick={handleRowClick}
      />
    </div>
  );
}
