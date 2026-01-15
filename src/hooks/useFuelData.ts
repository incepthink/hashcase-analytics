"use client";

import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { BACKEND_URL_HS } from "@/utils/constants";

const BASE_URL = `${BACKEND_URL_HS}/hashcase-analytics`;

// Types for table responses
export interface PsychoUser {
  id: number;
  wallet_address: string;
  transaction_count: number;
  time: string;
  createdAt: string;
}

export interface FuelUser {
  id: number;
  wallet_address: string;
  transaction_count: number;
  time: string;
  createdAt: string;
}

export interface PsychoTransaction {
  id: number;
  hash: string;
  wallet_address: string;
  type: "SWAP" | "MINT" | "BURN";
  swap_type: "BUY" | "SELL";
  pool_id: string;
  amount: string;
  time: string;
  created_at: string;
}

export interface DieselTransaction {
  id: number;
  hash: string;
  wallet_address: string;
  type: "SWAP" | "MINT" | "BURN";
  swap_type: "BUY" | "SELL";
  pool_id: string;
  time: string;
  created_at: string;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  totalPages: number;
  totalRecords: number;
}

export interface TableResponse<T> {
  overview: { total: number };
  data: T[];
  pagination: PaginationInfo;
}

// Types for chart responses
export interface UserChartData {
  date: string;
  totalUsers: number;
}

export interface TransactionChartData {
  date: string;
  totalTransactions: number;
}

export interface ChartDataset {
  data: { date: string; totalUsers: number }[];
  color: string;
  label: string;
}

// Hook for Fuel Users Pie Chart (combines psycho-users and fuel-users overview)
export function useFuelUsersPieChart() {
  const [data, setData] = useState<{ name: string; total: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [psychoRes, fuelRes] = await Promise.all([
          axios.get<TableResponse<PsychoUser>>(`${BASE_URL}/table/psycho-users?page=1&limit=1`),
          axios.get<TableResponse<FuelUser>>(`${BASE_URL}/table/fuel-users?page=1&limit=1`),
        ]);

        setData([
          { name: "Psycho Users", total: psychoRes.data.overview.total },
          { name: "Diesel Dex Users", total: fuelRes.data.overview.total },
        ]);
        setError(null);
      } catch (err) {
        console.error("Error fetching fuel users pie chart data:", err);
        setError("Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, loading, error };
}

// Hook for Psycho Users Table
export function usePsychoUsersTable() {
  const [data, setData] = useState<PsychoUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get<TableResponse<PsychoUser>>(
        `${BASE_URL}/table/psycho-users?page=${page + 1}&limit=${rowsPerPage}`
      );
      setData(response.data.data);
      setTotalCount(response.data.overview.total);
      setError(null);
    } catch (err) {
      console.error("Error fetching psycho users:", err);
      setError("Failed to load data");
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, page, setPage, rowsPerPage, setRowsPerPage, totalCount };
}

// Hook for Psycho Transactions Table
export function usePsychoTransactionsTable() {
  const [data, setData] = useState<PsychoTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get<TableResponse<PsychoTransaction>>(
        `${BASE_URL}/table/psycho-transactions?page=${page + 1}&limit=${rowsPerPage}`
      );
      setData(response.data.data);
      setTotalCount(response.data.overview.total);
      setError(null);
    } catch (err) {
      console.error("Error fetching psycho transactions:", err);
      setError("Failed to load data");
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, page, setPage, rowsPerPage, setRowsPerPage, totalCount };
}

// Hook for Diesel Transactions Table
export function useDieselTransactionsTable() {
  const [data, setData] = useState<DieselTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get<TableResponse<DieselTransaction>>(
        `${BASE_URL}/table/diesel-transactions?page=${page + 1}&limit=${rowsPerPage}`
      );
      setData(response.data.data);
      setTotalCount(response.data.overview.total);
      setError(null);
    } catch (err) {
      console.error("Error fetching diesel transactions:", err);
      setError("Failed to load data");
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, page, setPage, rowsPerPage, setRowsPerPage, totalCount };
}

// Hook for Fuel Users Table (Diesel DEX users)
export function useFuelUsersTable() {
  const [data, setData] = useState<FuelUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get<TableResponse<FuelUser>>(
        `${BASE_URL}/table/fuel-users?page=${page + 1}&limit=${rowsPerPage}`
      );
      setData(response.data.data);
      setTotalCount(response.data.overview.total);
      setError(null);
    } catch (err) {
      console.error("Error fetching fuel users:", err);
      setError("Failed to load data");
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, page, setPage, rowsPerPage, setRowsPerPage, totalCount };
}

// Hook for Psycho Users Chart
export function usePsychoUsersChart() {
  const [chartDatasets, setChartDatasets] = useState<ChartDataset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get<UserChartData[]>(`${BASE_URL}/chart/psycho-users`);
        setChartDatasets([
          {
            data: response.data,
            color: "#FF6B6B",
            label: "Psycho Users",
          },
        ]);
        setError(null);
      } catch (err) {
        console.error("Error fetching psycho users chart:", err);
        setError("Failed to load chart data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { chartDatasets, loading, error };
}

// Hook for Psycho Transactions Chart
export function usePsychoTransactionsChart() {
  const [chartDatasets, setChartDatasets] = useState<ChartDataset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get<TransactionChartData[]>(`${BASE_URL}/chart/psycho-transactions`);
        // Convert totalTransactions to totalUsers for chart compatibility
        const convertedData = response.data.map((item) => ({
          date: item.date,
          totalUsers: item.totalTransactions,
        }));
        setChartDatasets([
          {
            data: convertedData,
            color: "#FF6B6B",
            label: "Psycho Transactions",
          },
        ]);
        setError(null);
      } catch (err) {
        console.error("Error fetching psycho transactions chart:", err);
        setError("Failed to load chart data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { chartDatasets, loading, error };
}

// Hook for Fuel Users Chart (Diesel DEX)
export function useFuelUsersChart() {
  const [chartDatasets, setChartDatasets] = useState<ChartDataset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get<UserChartData[]>(`${BASE_URL}/chart/fuel-users`);
        setChartDatasets([
          {
            data: response.data,
            color: "#4ECDC4",
            label: "Fuel Users",
          },
        ]);
        setError(null);
      } catch (err) {
        console.error("Error fetching fuel users chart:", err);
        setError("Failed to load chart data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { chartDatasets, loading, error };
}

// Hook for Diesel Transactions Chart
export function useDieselTransactionsChart() {
  const [chartDatasets, setChartDatasets] = useState<ChartDataset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get<TransactionChartData[]>(`${BASE_URL}/chart/diesel-transactions`);
        // Convert totalTransactions to totalUsers for chart compatibility
        const convertedData = response.data.map((item) => ({
          date: item.date,
          totalUsers: item.totalTransactions,
        }));
        setChartDatasets([
          {
            data: convertedData,
            color: "#4ECDC4",
            label: "Diesel Transactions",
          },
        ]);
        setError(null);
      } catch (err) {
        console.error("Error fetching diesel transactions chart:", err);
        setError("Failed to load chart data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { chartDatasets, loading, error };
}
