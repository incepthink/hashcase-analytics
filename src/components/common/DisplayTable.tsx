"use client";

import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  CircularProgress,
  Box,
} from "@mui/material";

export interface ColumnDef<T> {
  id: string;
  label: string;
  align?: "left" | "right" | "center";
  render: (row: T) => React.ReactNode;
}

interface DisplayTableProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
  loading?: boolean;
  error?: string | null;
  keyExtractor: (row: T) => string;
  // Pagination props
  page: number;
  rowsPerPage: number;
  totalCount: number;
  onPageChange: (newPage: number) => void;
  onRowsPerPageChange: (newRowsPerPage: number) => void;
  rowsPerPageOptions?: number[];
  emptyMessage?: string;
  onRowClick?: (row: T) => void;
  expandableRow?: (row: T) => React.ReactNode;
}

export default function DisplayTable<T>({
  columns,
  data,
  loading = false,
  error = null,
  keyExtractor,
  page,
  rowsPerPage,
  totalCount,
  onPageChange,
  onRowsPerPageChange,
  rowsPerPageOptions = [10, 25, 50, 100],
  emptyMessage = "No data found",
  onRowClick,
  expandableRow,
}: DisplayTableProps<T>) {
  const handleChangePage = (_event: unknown, newPage: number) => {
    onPageChange(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    onRowsPerPageChange(parseInt(event.target.value, 10));
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Paper sx={{ p: 3, bgcolor: "#1a1a1a" }}>
        <p className="text-red-500">{error}</p>
      </Paper>
    );
  }

  return (
    <>
      <TableContainer component={Paper} sx={{ bgcolor: "#1a1a1a" }}>
        <Table>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align || "left"}
                  sx={{ color: "#fff", fontWeight: 500 }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  align="center"
                  sx={{ color: "#fff" }}
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            ) : (
              data.map((row) => (
                <React.Fragment key={keyExtractor(row)}>
                  <TableRow
                    hover
                    onClick={() => onRowClick?.(row)}
                    sx={{ cursor: onRowClick ? "pointer" : "default" }}
                  >
                    {columns.map((column) => (
                      <TableCell
                        key={column.id}
                        align={column.align || "left"}
                        sx={{ color: "#fff" }}
                      >
                        {column.render(row)}
                      </TableCell>
                    ))}
                  </TableRow>
                  {expandableRow && (
                    <TableRow>
                      <TableCell
                        colSpan={columns.length}
                        sx={{
                          p: 0,
                          bgcolor: "#0a0a0a",
                          borderBottom: "none"
                        }}
                      >
                        {expandableRow(row)}
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component={Paper}
        sx={{
          bgcolor: "#1a1a1a",
          mt: 2,
          color: "#fff",
          "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows": {
            color: "#fff",
          },
          "& .MuiTablePagination-select": {
            color: "#fff",
          },
          "& .MuiIconButton-root": {
            color: "#fff",
          },
        }}
        rowsPerPageOptions={rowsPerPageOptions}
        count={totalCount}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </>
  );
}
