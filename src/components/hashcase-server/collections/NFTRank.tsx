"use client";

import { Paper } from "@mui/material";
import { TopNFT } from "@/types/nft";
import Image from "next/image";
import { useState } from "react";

interface NFTRankProps {
  topNFTs: TopNFT[];
}

export default function NFTRank({ topNFTs }: NFTRankProps) {
  // Rank colors for visual distinction
  const rankColors: Record<1 | 2 | 3, string> = {
    1: "#FFD700", // Gold
    2: "#C0C0C0", // Silver
    3: "#CD7F32", // Bronze
  };

  return (
    <div className="pb-6">
      <div className="mb-6">
        <h3 className="text-xl font-semibold">Top NFTs by Unique Mints</h3>
        <p className="text-sm text-gray-400 mt-1">
          Most popular NFTs based on unique user mints
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {topNFTs.map((nft) => (
          <RankCard key={nft.id} nft={nft} rankColor={rankColors[nft.rank]} />
        ))}
      </div>
    </div>
  );
}

interface RankCardProps {
  nft: TopNFT;
  rankColor: string;
}

function RankCard({ nft, rankColor }: RankCardProps) {
  const [imageError, setImageError] = useState(false);

  return (
    <Paper
      sx={{
        bgcolor: "#1a1a1a",
        borderTop: `4px solid ${rankColor}`,
        overflow: "hidden",
        transition: "transform 0.2s",
        "&:hover": {
          transform: "translateY(-4px)",
        },
      }}
    >
      {/* Rank Badge and NFT Image */}
      <div className="relative">
        <div
          className="absolute top-4 left-4 w-12 h-12 rounded-full flex items-center justify-center text-2xl font-bold z-10"
          style={{
            backgroundColor: rankColor,
            color: "#000",
            boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
          }}
        >
          {nft.rank}
        </div>

        {/* NFT Image */}
        <div className="relative w-full h-64 bg-gray-800">
          {!imageError && nft.image ? (
            <Image
              src={nft.image}
              alt={nft.name}
              fill
              className="object-cover"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <svg
                className="w-20 h-20 text-gray-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          )}
        </div>
      </div>

      {/* NFT Info */}
      <div className="p-4">
        <h4 className="text-lg font-semibold text-white mb-2 truncate">
          {nft.name}
        </h4>
        <p className="text-sm text-gray-400 mb-4 line-clamp-2">
          {nft.description || "No description available"}
        </p>

        {/* Stats */}
        <div className="flex justify-between items-center pt-3 border-t border-gray-700">
          <div>
            <p className="text-xs text-gray-500">Unique Mints</p>
            <p className="text-lg font-bold" style={{ color: rankColor }}>
              {nft.uniqueUserMints}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Total Mints</p>
            <p className="text-lg font-bold text-white">{nft.totalMints}</p>
          </div>
        </div>
      </div>
    </Paper>
  );
}
