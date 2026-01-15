"use client";

import DisplayTable, { ColumnDef } from "@/components/common/DisplayTable";
import { usePsychoUsersTable, PsychoUser } from "@/hooks/useFuelData";

const columns: ColumnDef<PsychoUser>[] = [
  {
    id: "id",
    label: "ID",
    render: (row) => row.id,
  },
  {
    id: "wallet_address",
    label: "Wallet Address",
    render: (row) => (
      <span className="font-mono text-sm">
        {row.wallet_address.slice(0, 8)}...{row.wallet_address.slice(-6)}
      </span>
    ),
  },
  {
    id: "transaction_count",
    label: "Transactions",
    align: "right",
    render: (row) => row.transaction_count.toLocaleString(),
  },
  {
    id: "time",
    label: "Last Active",
    render: (row) => new Date(row.time).toLocaleString(),
  },
  {
    id: "createdAt",
    label: "Created At",
    render: (row) => new Date(row.createdAt).toLocaleString(),
  },
];

export default function PsychoUsersTable() {
  const { data, loading, error, page, setPage, rowsPerPage, setRowsPerPage, totalCount } =
    usePsychoUsersTable();

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Psycho Users</h2>
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
