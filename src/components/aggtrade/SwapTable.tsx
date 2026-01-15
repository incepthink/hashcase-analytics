"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { BACKEND_URL_AT } from "@/utils/constants";
import {
  Paper,
  Select,
  MenuItem,
  Button,
  TextField,
  Chip,
  SelectChangeEvent,
} from "@mui/material";
import DisplayTable, { ColumnDef } from "../common/DisplayTable";

interface TokenInfo {
  symbol: string;
  address: string;
  logo?: string;
}

interface TokenPair {
  from: TokenInfo;
  to: TokenInfo;
  display: string;
}

interface Swap {
  tx_hash: string;
  swap_type: "CLASSIC" | "LIMIT_ORDER";
  token_pair: TokenPair;
  usd_volume: number;
  wallet_address: string;
  timestamp: string;
}

interface Statistics {
  classic: {
    count: number;
    total_volume_usd: number;
  };
  limit_order: {
    count: number;
    total_volume_usd: number;
  };
}

interface Pagination {
  total: number;
  returned: number;
  has_more: boolean;
}

interface SwapTableResponse {
  swaps: Swap[];
  statistics: Statistics;
  pagination: Pagination;
}

type SwapType = "ALL" | "CLASSIC" | "LIMIT_ORDER";
type SortBy = "timestamp" | "usd_volume" | "wallet_address";
type SortOrder = "DESC" | "ASC";

export default function SwapTable() {
  const [swaps, setSwaps] = useState<Swap[]>([]);
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [swapType, setSwapType] = useState<SwapType>("ALL");
  const [sortBy, setSortBy] = useState<SortBy>("timestamp");
  const [sortOrder, setSortOrder] = useState<SortOrder>("DESC");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [walletAddress, setWalletAddress] = useState<string>("");

  // Pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  const fetchSwaps = async () => {
    try {
      setLoading(true);
      setError(null);

      const params: Record<string, string | number> = {
        limit: rowsPerPage,
        offset: page * rowsPerPage,
        sortBy,
        sortOrder,
        status: "success",
      };

      if (swapType !== "ALL") {
        params.swap_type = swapType;
      }
      if (startDate) {
        params.start_date = startDate;
      }
      if (endDate) {
        params.end_date = endDate;
      }
      if (walletAddress.trim()) {
        params.wallet_address = walletAddress.trim();
      }

      const response = await axios.get<SwapTableResponse>(
        `${BACKEND_URL_AT}/hashcase-analytics/table/swaps`,
        { params }
      );

      setSwaps(response.data.swaps);
      setStatistics(response.data.statistics);
      setTotalCount(response.data.pagination.total);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching swaps:", err);
      setError("Failed to load swaps data");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSwaps();
  }, [page, rowsPerPage, swapType, sortBy, sortOrder, startDate, endDate]);

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSortByChange = (event: SelectChangeEvent<SortBy>) => {
    setSortBy(event.target.value as SortBy);
    setPage(0);
  };

  const handleSortOrderChange = (event: SelectChangeEvent<SortOrder>) => {
    setSortOrder(event.target.value as SortOrder);
    setPage(0);
  };

  const handleWalletSearch = () => {
    setPage(0);
    fetchSwaps();
  };

  const truncateAddress = (address: string | number | null | undefined) => {
    if (!address) return "";
    const addressStr = String(address);
    return `${addressStr.slice(0, 6)}...${addressStr.slice(-4)}`;
  };

  const formatUSD = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
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

  const columns: ColumnDef<Swap>[] = [
    {
      id: "tx_hash",
      label: "Transaction Hash",
      render: (swap) => (
        <a
          href={`https://explorer.arthera.net/tx/${swap.tx_hash}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 hover:text-blue-300 underline"
        >
          {truncateAddress(swap.tx_hash)}
        </a>
      ),
    },
    {
      id: "swap_type",
      label: "Type",
      render: (swap) => (
        <Chip
          label={swap.swap_type}
          size="small"
          sx={{
            bgcolor: swap.swap_type === "CLASSIC" ? "#1976d2" : "#d946ef",
            color: "#fff",
            fontWeight: 500,
          }}
        />
      ),
    },
    {
      id: "token_pair",
      label: "Token Pair",
      render: (swap) => (
        <div className="flex items-center gap-2">
          {swap.token_pair.from.logo && (
            <img
              src={swap.token_pair.from.logo}
              alt={swap.token_pair.from.symbol}
              className="w-5 h-5 rounded-full"
            />
          )}
          <span>{swap.token_pair.from.symbol}</span>
          <span>→</span>
          {swap.token_pair.to.logo && (
            <img
              src={swap.token_pair.to.logo}
              alt={swap.token_pair.to.symbol}
              className="w-5 h-5 rounded-full"
            />
          )}
          <span>{swap.token_pair.to.symbol}</span>
        </div>
      ),
    },
    {
      id: "usd_volume",
      label: "USD Volume",
      align: "right" as const,
      render: (swap) => formatUSD(swap.usd_volume),
    },
    {
      id: "wallet_address",
      label: "Wallet",
      render: (swap) => (
        <a
          href={`https://explorer.arthera.net/address/${swap.wallet_address}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 hover:text-blue-300 underline"
        >
          {truncateAddress(swap.wallet_address)}
        </a>
      ),
    },
    {
      id: "timestamp",
      label: "Timestamp",
      render: (swap) => formatTimestamp(swap.timestamp),
    },
  ];

  return (
    <div className="pb-10">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">Swaps Table</h2>
        {statistics && (
          <div className="flex gap-4 text-sm">
            <div>
              Classic: {statistics.classic.count} (
              {formatUSD(statistics.classic.total_volume_usd)})
            </div>
            <div>
              Limit Orders: {statistics.limit_order.count} (
              {formatUSD(statistics.limit_order.total_volume_usd)})
            </div>
          </div>
        )}
      </div>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3, bgcolor: "#1a1a1a" }}>
        <div className="flex flex-wrap gap-4 items-end">
          <div className="flex justify-between w-full">
            {/* Swap Type Filter */}
            <div className="flex gap-2">
              <Button
                variant={swapType === "ALL" ? "contained" : "outlined"}
                onClick={() => {
                  setSwapType("ALL");
                  setPage(0);
                }}
                size="small"
                sx={{
                  bgcolor: swapType === "ALL" ? "#1976d2" : "transparent",
                  borderColor: "#1976d2",
                  color: swapType === "ALL" ? "#fff" : "#1976d2",
                  "&:hover": {
                    bgcolor:
                      swapType === "ALL"
                        ? "#1565c0"
                        : "rgba(25, 118, 210, 0.1)",
                  },
                }}
              >
                ALL
              </Button>
              <Button
                variant={swapType === "CLASSIC" ? "contained" : "outlined"}
                onClick={() => {
                  setSwapType("CLASSIC");
                  setPage(0);
                }}
                size="small"
                sx={{
                  bgcolor: swapType === "CLASSIC" ? "#1976d2" : "transparent",
                  borderColor: "#1976d2",
                  color: swapType === "CLASSIC" ? "#fff" : "#1976d2",
                  "&:hover": {
                    bgcolor:
                      swapType === "CLASSIC"
                        ? "#1565c0"
                        : "rgba(25, 118, 210, 0.1)",
                  },
                }}
              >
                CLASSIC
              </Button>
              <Button
                variant={swapType === "LIMIT_ORDER" ? "contained" : "outlined"}
                onClick={() => {
                  setSwapType("LIMIT_ORDER");
                  setPage(0);
                }}
                size="small"
                sx={{
                  bgcolor:
                    swapType === "LIMIT_ORDER" ? "#1976d2" : "transparent",
                  borderColor: "#1976d2",
                  color: swapType === "LIMIT_ORDER" ? "#fff" : "#1976d2",
                  "&:hover": {
                    bgcolor:
                      swapType === "LIMIT_ORDER"
                        ? "#1565c0"
                        : "rgba(25, 118, 210, 0.1)",
                  },
                }}
              >
                LIMIT ORDER
              </Button>
            </div>
            <div className="flex gap-2 items-center">
              {/* Sort Controls */}
              <div className="flex gap-2 items-center">
                <span className="text-sm text-white">Sort by:</span>
                <Select
                  value={sortBy}
                  onChange={handleSortByChange}
                  size="small"
                  sx={{
                    minWidth: 150,
                    color: "#fff",
                    ".MuiOutlinedInput-notchedOutline": {
                      borderColor: "rgba(255, 255, 255, 0.23)",
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "rgba(255, 255, 255, 0.4)",
                    },
                    "& .MuiSvgIcon-root": {
                      color: "#fff",
                    },
                  }}
                >
                  <MenuItem value="timestamp">Timestamp</MenuItem>
                  <MenuItem value="usd_volume">USD Volume</MenuItem>
                  {/* <MenuItem value="wallet_address">Wallet Address</MenuItem> */}
                </Select>
                <Select
                  value={sortOrder}
                  onChange={handleSortOrderChange}
                  size="small"
                  sx={{
                    minWidth: 100,
                    color: "#fff",
                    ".MuiOutlinedInput-notchedOutline": {
                      borderColor: "rgba(255, 255, 255, 0.23)",
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "rgba(255, 255, 255, 0.4)",
                    },
                    "& .MuiSvgIcon-root": {
                      color: "#fff",
                    },
                  }}
                >
                  <MenuItem value="DESC">DESC</MenuItem>
                  <MenuItem value="ASC">ASC</MenuItem>
                </Select>
              </div>

              {/* Date Range */}
              <div className="flex gap-2 items-center">
                <TextField
                  type="date"
                  label="Start Date"
                  value={startDate}
                  onChange={(e) => {
                    setStartDate(e.target.value);
                    setPage(0);
                  }}
                  size="small"
                  InputLabelProps={{ shrink: true }}
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
                    "& .MuiSvgIcon-root": {
                      color: "#fff",
                    },
                  }}
                />
                <TextField
                  type="date"
                  label="End Date"
                  value={endDate}
                  onChange={(e) => {
                    setEndDate(e.target.value);
                    setPage(0);
                  }}
                  size="small"
                  InputLabelProps={{ shrink: true }}
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
                    "& .MuiSvgIcon-root": {
                      color: "#fff",
                    },
                  }}
                />
              </div>

              {/* Wallet Address Filter */}
              {/* <div className="flex gap-2">
                <TextField
                  label="Wallet Address"
                  value={walletAddress}
                  onChange={(e) => setWalletAddress(e.target.value)}
                  size="small"
                  placeholder="0x..."
                  sx={{
                    minWidth: 200,
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
                <Button
                  variant="contained"
                  onClick={handleWalletSearch}
                  size="small"
                  sx={{
                    bgcolor: "#1976d2",
                    "&:hover": {
                      bgcolor: "#1565c0",
                    },
                  }}
                >
                  SEARCH
                </Button>
              </div> */}
            </div>
          </div>
        </div>
      </Paper>

      {/* Table */}
      <DisplayTable
        columns={columns}
        data={swaps}
        loading={loading}
        error={error}
        keyExtractor={(swap) => swap.tx_hash}
        page={page}
        rowsPerPage={rowsPerPage}
        totalCount={totalCount}
        onPageChange={(newPage) => setPage(newPage)}
        onRowsPerPageChange={(newRowsPerPage) => {
          setRowsPerPage(newRowsPerPage);
          setPage(0);
        }}
        emptyMessage="No swaps found"
      />
    </div>
  );
}
