"use client";

import { useParams } from "next/navigation";
import { useScrollToTop } from "@/hooks/useScrollToTop";
import { Box, Container } from "@mui/material";
import NFTOverview from "@/components/hashcase-server/collections/NFTOverview";
import StreakTable from "@/components/hashcase-server/collections/StreakTable";
import QuestOverview from "@/components/hashcase-server/collections/QuestOverview";
import Image from "next/image";
import UserInteractionTable from "@/components/hashcase-server/collections/UserInteractionTable";
import UserInteractionChart from "@/components/hashcase-server/collections/UserInteractionChart";
import { useCollection } from "@/hooks/useCollections";
import Link from "next/link";
import { useState } from "react";

type TabType = "users" | "nfts" | "streak" | "quests";

export default function CollectionDetailsPage() {
  const params = useParams();
  const collectionId = params.collection_id as string;
  const [activeTab, setActiveTab] = useState<TabType>("users");

  // Fetch collection data using TanStack Query
  const { data: collection, isLoading, error } = useCollection(collectionId);

  // Get collection data with fallbacks
  const collectionName = collection?.name || "Unknown Collection";
  const collectionDescription = collection?.description || "";
  const collectionImageUri = collection?.image_uri || "";

  // Scroll to top when navigating to this page
  useScrollToTop("auto", [collectionId]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-xl text-gray-400">Loading collection...</div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-xl text-red-400">Failed to load collection</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Container className="pt-10" maxWidth="xl">
        <div className="mb-8">
          <div className="flex items-start gap-6">
            {/* Collection Image */}
            {collectionImageUri && (
              <div className="flex-shrink-0">
                <div className="relative w-32 h-32 rounded-lg overflow-hidden bg-gray-800">
                  <Image
                    src={collectionImageUri}
                    alt={collectionName}
                    fill
                    className="object-cover"
                    onError={(e) => {
                      // Hide image on error
                      e.currentTarget.style.display = "none";
                    }}
                  />
                </div>
              </div>
            )}

            {/* Collection Info */}
            <div className="flex-1">
              <h1 className="text-3xl font-semibold mb-2">{collectionName}</h1>
              {collectionDescription && (
                <p className="text-base text-gray-300 mb-3">
                  {collectionDescription}
                </p>
              )}
              <p className="text-sm text-gray-400">
                Collection ID:{" "}
                <span className="font-mono text-cyan-400">{collectionId}</span>
              </p>
            </div>
          </div>
        </div>
      </Container>

      <div className="w-full sticky top-10 bg-black p-3 z-10">
        <div className="flex gap-8 justify-center text-xl">
          <button
            onClick={() => setActiveTab("users")}
            className={`cursor-pointer pb-2 transition-all ${
              activeTab === "users"
                ? "border-b-2 border-purple-500 text-white"
                : "text-gray-400 hover:text-gray-200"
            }`}
          >
            Users
          </button>
          <button
            onClick={() => setActiveTab("nfts")}
            className={`cursor-pointer pb-2 transition-all ${
              activeTab === "nfts"
                ? "border-b-2 border-purple-500 text-white"
                : "text-gray-400 hover:text-gray-200"
            }`}
          >
            NFTS
          </button>
          <button
            onClick={() => setActiveTab("streak")}
            className={`cursor-pointer pb-2 transition-all ${
              activeTab === "streak"
                ? "border-b-2 border-purple-500 text-white"
                : "text-gray-400 hover:text-gray-200"
            }`}
          >
            Streak
          </button>
          <button
            onClick={() => setActiveTab("quests")}
            className={`cursor-pointer pb-2 transition-all ${
              activeTab === "quests"
                ? "border-b-2 border-purple-500 text-white"
                : "text-gray-400 hover:text-gray-200"
            }`}
          >
            Quests
          </button>
        </div>
      </div>
      <Container className="pt-10" maxWidth="xl">
        {activeTab === "users" && (
          <>
            <UserInteractionChart collectionId={Number(collectionId)} />
            <UserInteractionTable collectionId={Number(collectionId)} />
          </>
        )}
        {activeTab === "nfts" && <NFTOverview collectionId={collectionId} />}
        {activeTab === "streak" && <StreakTable collectionId={collectionId} />}
        {activeTab === "quests" && (
          <QuestOverview collectionId={collectionId} />
        )}
      </Container>
    </div>
  );
}
