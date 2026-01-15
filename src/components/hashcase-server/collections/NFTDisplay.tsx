"use client";

import { useState } from "react";
import { Paper, Box } from "@mui/material";
import Pagination from "@mui/material/Pagination";
import { NFTMetadata } from "@/types/nft";
import Image from "next/image";

interface NFTDisplayProps {
  nfts: NFTMetadata[];
}

export default function NFTDisplay({ nfts }: NFTDisplayProps) {
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);

  const totalPages = Math.ceil(nfts.length / itemsPerPage);
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentNFTs = nfts.slice(startIndex, endIndex);

  const handlePageChange = (
    _event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage(value);
    // Scroll to top of grid when page changes
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setPage(1); // Reset to first page
  };

  return (
    <div className="pb-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-semibold">All NFTs</h3>
          <p className="text-sm text-gray-400 mt-1">
            Showing {startIndex + 1}-{Math.min(endIndex, nfts.length)} of{" "}
            {nfts.length} NFTs
          </p>
        </div>

        {/* Items per page selector */}
        <div className="flex gap-2 items-center">
          <span className="text-sm text-gray-400">Per page:</span>
          {[12, 24, 48].map((count) => (
            <button
              key={count}
              onClick={() => handleItemsPerPageChange(count)}
              className={`px-3 py-1 rounded text-sm transition-colors ${
                itemsPerPage === count
                  ? "bg-cyan-500 text-black font-semibold"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              {count}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of NFT Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-6">
        {currentNFTs.map((nft) => (
          <NFTCard key={nft.id} nft={nft} />
        ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <Box display="flex" justifyContent="center" mt={4}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            color="primary"
            size="large"
            sx={{
              "& .MuiPaginationItem-root": {
                color: "#fff",
              },
              "& .Mui-selected": {
                backgroundColor: "#00FFE9",
                color: "#000",
                fontWeight: "bold",
              },
            }}
          />
        </Box>
      )}
    </div>
  );
}

interface NFTCardProps {
  nft: NFTMetadata;
}

function NFTCard({ nft }: NFTCardProps) {
  const [imageError, setImageError] = useState(false);

  return (
    <Paper
      sx={{
        bgcolor: "#1a1a1a",
        overflow: "hidden",
        transition: "transform 0.2s, box-shadow 0.2s",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 8px 24px rgba(0, 255, 233, 0.15)",
        },
      }}
    >
      {/* NFT Image */}
      <div className="relative w-full h-48 bg-gray-800">
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
              className="w-16 h-16 text-gray-600"
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

      {/* NFT Info */}
      <div className="p-3">
        <h4 className="text-md font-semibold text-white mb-1 truncate">
          {nft.name}
        </h4>
        <p className="text-xs text-gray-400 mb-3 line-clamp-2 h-8">
          {nft.description || "No description"}
        </p>

        {/* Stats - Compact */}
        <div className="flex justify-between items-center text-xs">
          <div>
            <p className="text-gray-500">Unique</p>
            <p className="text-cyan-400 font-semibold">{nft.uniqueUserMints}</p>
          </div>
          <div>
            <p className="text-gray-500">Total</p>
            <p className="text-white font-semibold">{nft.totalMints}</p>
          </div>
        </div>
      </div>
    </Paper>
  );
}
