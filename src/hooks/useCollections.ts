import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { BACKEND_URL_HS } from "@/utils/constants";

export interface Collection {
  id: number;
  name: string;
  description: string;
  chain_name: string;
  owner_id: string;
  priority: number;
  image_uri: string;
  collection_address: string;
  tags: string[];
  createdAt: string;
}

// Fetch all collections
export const useCollections = () => {
  return useQuery({
    queryKey: ["collections"],
    queryFn: async () => {
      const response = await axios.get<Collection[]>(
        `${BACKEND_URL_HS}/hashcase-analytics/table/collections`
      );
      return response.data;
    },
  });
};

// Fetch a single collection by ID
export const useCollection = (collectionId: number | string) => {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ["collection", collectionId],
    queryFn: async () => {
      // First try to get from the collections cache
      const collectionsCache = queryClient.getQueryData<Collection[]>([
        "collections",
      ]);

      if (collectionsCache) {
        const collection = collectionsCache.find(
          (c) => c.id === Number(collectionId)
        );
        if (collection) {
          return collection;
        }
      }

      // If not in cache, fetch from API
      const response = await axios.get<Collection>(
        `${BACKEND_URL_HS}/hashcase-analytics/table/collections/${collectionId}`
      );
      return response.data;
    },
    enabled: !!collectionId,
  });
};
