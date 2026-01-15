"use client";

import { Container } from "@mui/material";
import { useState } from "react";
import FuelUsersPieChart from "@/components/fuel/FuelUsersPieChart";
import {
  DieselTransactionsTable,
  DieselTransactionsLineChart,
  DieselUsersTable,
  DieselUsersLineChart,
} from "@/components/fuel/dieseldex";
import {
  PsychoUsersTable,
  PsychoUsersLineChart,
  PsychoTransactionsTable,
  PsychoTransactionsLineChart,
} from "@/components/fuel/psycho";

type TabType = "diesel-dex" | "psycho";

export default function FuelPage() {
  const [activeTab, setActiveTab] = useState<TabType>("diesel-dex");

  return (
    <div className="min-h-screen">
      <Container className="pt-10" maxWidth="xl">
        <h1 className="text-3xl font-semibold mb-14">Fuel</h1>
        <FuelUsersPieChart />
      </Container>

      <div className="w-full sticky top-10 bg-black p-3 z-10">
        <div className="flex gap-8 justify-center text-xl">
          <button
            onClick={() => setActiveTab("diesel-dex")}
            className={`cursor-pointer pb-2 transition-all ${
              activeTab === "diesel-dex"
                ? "border-b-2 border-purple-500 text-white"
                : "text-gray-400 hover:text-gray-200"
            }`}
          >
            DIESEL DEX
          </button>
          <button
            onClick={() => setActiveTab("psycho")}
            className={`cursor-pointer pb-2 transition-all ${
              activeTab === "psycho"
                ? "border-b-2 border-purple-500 text-white"
                : "text-gray-400 hover:text-gray-200"
            }`}
          >
            PSYCHO
          </button>
        </div>
      </div>

      <Container className="py-10" maxWidth="xl">
        <div className="flex flex-col gap-16">
          {activeTab === "diesel-dex" && (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-1 gap-12">
                <DieselUsersLineChart />
                <DieselTransactionsLineChart />
              </div>
              <DieselUsersTable />
              <DieselTransactionsTable />
            </>
          )}
          {activeTab === "psycho" && (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-1 gap-12">
                <PsychoUsersLineChart />
                <PsychoTransactionsLineChart />
              </div>
              <PsychoUsersTable />
              <PsychoTransactionsTable />
            </>
          )}
        </div>
      </Container>
    </div>
  );
}
