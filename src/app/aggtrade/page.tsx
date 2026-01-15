import SwapChart from "@/components/aggtrade/SwapChart";
import SwapTable from "@/components/aggtrade/SwapTable";
import { Container } from "@mui/material";

export default function page() {
  return (
    <div className="min-h-screen">
      <Container className="pt-10" maxWidth="xl">
        <h1 className="text-3xl font-semibold mb-14">Aggtrade</h1>
        <div className="flex flex-col gap-16">
          <SwapChart />
          <SwapTable />
        </div>
      </Container>
    </div>
  );
}
