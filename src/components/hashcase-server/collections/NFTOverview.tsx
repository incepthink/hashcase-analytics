"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { BACKEND_URL_HS } from "@/utils/constants";
import { CircularProgress, Box, Paper } from "@mui/material";
import NFTRank from "./NFTRank";
import NFTDisplay from "./NFTDisplay";
import NFTTable from "./NFTTable";
import { NFTCollectionResponse } from "@/types/nft";

interface NFTOverviewProps {
  collectionId: string;
}

export default function NFTOverview({ collectionId }: NFTOverviewProps) {
  const [data, setData] = useState<NFTCollectionResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNFTData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get<NFTCollectionResponse>(
        `${BACKEND_URL_HS}/hashcase-analytics/table/collections/${collectionId}/nfts`
      );

      setData(response.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching NFT data:", err);
      setError("Failed to load NFT data");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNFTData();
  }, [collectionId]);

  // Loading state
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <CircularProgress />
      </Box>
    );
  }

  // Error state
  if (error) {
    return (
      <Paper sx={{ p: 3, bgcolor: "#1a1a1a" }}>
        <p className="text-red-500">{error}</p>
      </Paper>
    );
  }

  // No data state
  if (!data) {
    return null;
  }

  return (
    <div className="flex flex-col gap-10">
      {/* Header with collection stats */}
      <div className="mb-2">
        <h2 className="text-2xl font-semibold mb-2">NFT Collection Overview</h2>
        <div className="flex gap-6 text-sm text-gray-400">
          <span>Total NFTs: {data.total_nfts}</span>
          <span>Unique Metadata: {data.unique_metadata_count}</span>
        </div>
      </div>

      {/* Top 3 NFTs by unique mints */}
      {data.top_3_by_unique_mints.length > 0 && (
        <NFTRank topNFTs={data.top_3_by_unique_mints} />
      )}

      {/* All NFTs Grid with pagination */}
      {data.all_nfts.length > 0 && <NFTDisplay nfts={data.all_nfts} />}

      {/* Mint History Table */}
      {data.nft_mints.length > 0 && <NFTTable mints={data.nft_mints} />}
    </div>
  );
}
