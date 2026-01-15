import Navbar from "@/components/common/Navbar";
import SwapChart from "@/components/aggtrade/SwapChart";
import UserLineChart from "@/components/home/UserLineChart";
import { Container } from "@mui/material";
import Image from "next/image";
import UserPieChart from "@/components/home/UserPieChart";
import UserProjectPieChart from "@/components/home/UserProjectPieChart";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Container className="pt-10" maxWidth="xl">
        <div className="flex flex-col gap-16">
          <UserLineChart />
          <UserPieChart />
          <UserProjectPieChart />
        </div>
      </Container>
    </div>
  );
}
