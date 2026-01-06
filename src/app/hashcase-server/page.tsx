import MintChart from "@/components/hashcase-server/MintChart";
import { Container } from "@mui/material";

export default function page() {
  return (
    <div className="min-h-screen">
      <Container className="pt-10" maxWidth="xl">
        <h1 className="text-3xl font-semibold mb-14">Hashcase Server</h1>
        <div className="flex flex-col gap-16">
          <MintChart />
        </div>
      </Container>
    </div>
  );
}
