import { useEffect, useState } from "react";
import axios from "axios";
import { BACKEND_URL_HS } from "@/utils/constants";

export interface Collection {
  id: number;
  name: string;
  description: string;
  image: string;
  chain_name: string;
  contract_address: string;
  items_number: number;
  launch_date: string;
  total_users: number;
}

export interface CollectionsResponse {
  total_collections: number;
  collections: Collection[];
}

export function useCollectionsUsers() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const response = await axios.get<CollectionsResponse>(
          `${BACKEND_URL_HS}/hashcase-analytics/opensea-collections/users`
        );

        setCollections(response.data.collections);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching collections data:", err);
        setError("Failed to load collections data");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { collections, loading, error };
}
