import { Box } from "@mui/material";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="sticky top-0 backdrop-blur-md bg-white/80 dark:bg-black/80 z-50">
      <Box
        className="mx-auto p-3  flex items-end justify-between"
        maxWidth={"xl"}
      >
        <Link href={"/"} className="font-semibold text-2xl cursor-pointer">
          Hashcase Analytics
        </Link>
        <div className="flex gap-8 text-xl">
          <Link href={"/hashcase-server"} className="cursor-pointer">
            Hashcase-Server
          </Link>
          <Link href={"/aggtrade"} className="cursor-pointer">
            Aggtrade
          </Link>
          <Link href={"/fuel"} className="cursor-pointer">
            Fuel
          </Link>
        </div>
      </Box>
    </nav>
  );
}
