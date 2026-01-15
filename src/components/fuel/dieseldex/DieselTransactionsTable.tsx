"use client";

import DisplayTable, { ColumnDef } from "@/components/common/DisplayTable";
import {
  useDieselTransactionsTable,
  DieselTransaction,
} from "@/hooks/useFuelData";

const columns: ColumnDef<DieselTransaction>[] = [
  {
    id: "id",
    label: "ID",
    render: (row) => row.id,
  },
  {
    id: "hash",
    label: "Hash",
    render: (row) => (
      <span className="font-mono text-sm">
        {row.hash.slice(0, 8)}...{row.hash.slice(-6)}
      </span>
    ),
  },
  {
    id: "wallet_address",
    label: "Wallet",
    render: (row) => (
      <span className="font-mono text-sm">
        {row.wallet_address.slice(0, 8)}...{row.wallet_address.slice(-6)}
      </span>
    ),
  },
  {
    id: "type",
    label: "Type",
    render: (row) => (
      <span
        className={`px-2 py-1 rounded text-xs font-medium ${
          row.type === "SWAP"
            ? "bg-blue-500/20 text-blue-400"
            : row.type === "MINT"
            ? "bg-green-500/20 text-green-400"
            : "bg-red-500/20 text-red-400"
        }`}
      >
        {row.type}
      </span>
    ),
  },
  // {
  //   id: "swap_type",
  //   label: "Swap Type",
  //   render: (row) => (
  //     <span
  //       className={`px-2 py-1 rounded text-xs font-medium ${
  //         row.swap_type === "BUY"
  //           ? "bg-green-500/20 text-green-400"
  //           : "bg-red-500/20 text-red-400"
  //       }`}
  //     >
  //       {row.swap_type}
  //     </span>
  //   ),
  // },
  {
    id: "pool_id",
    label: "Pool ID",
    render: (row) => (
      <span className="font-mono text-sm">{row.pool_id.slice(0, 8)}...</span>
    ),
  },
  {
    id: "time",
    label: "Time",
    render: (row) => new Date(row.time).toLocaleString(),
  },
];

export default function DieselTransactionsTable() {
  const {
    data,
    loading,
    error,
    page,
    setPage,
    rowsPerPage,
    setRowsPerPage,
    totalCount,
  } = useDieselTransactionsTable();

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Diesel Transactions</h2>
      <DisplayTable
        columns={columns}
        data={data}
        loading={loading}
        error={error}
        keyExtractor={(row) => row.id.toString()}
        page={page}
        rowsPerPage={rowsPerPage}
        totalCount={totalCount}
        onPageChange={setPage}
        onRowsPerPageChange={(newRowsPerPage) => {
          setRowsPerPage(newRowsPerPage);
          setPage(0);
        }}
      />
    </div>
  );
}
