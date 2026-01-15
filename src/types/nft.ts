// Base NFT metadata structure
export interface NFTMetadata {
  id: number; // metadata_id
  name: string;
  description: string;
  image: string;
  animation_url: string;
  attributes: any; // JSON object
  token_uri: string;
  uniqueUserMints: number;
  totalMints: number;
}

// Top 3 NFTs with rank
export interface TopNFT extends NFTMetadata {
  rank: 1 | 2 | 3;
}

// Individual mint record
export interface NFTMint {
  id: number;
  user_id: number;
  user_address: string;
  name: string;
  description: string;
  image_uri: string;
  collection_id: number;
  token_id: number;
  metadata_id: number;
  createdAt: string;
}

// Full API response structure
export interface NFTCollectionResponse {
  collection_id: number;
  total_nfts: number;
  unique_metadata_count: number;
  top_3_by_unique_mints: TopNFT[];
  all_nfts: NFTMetadata[];
  nft_mints: NFTMint[];
}
