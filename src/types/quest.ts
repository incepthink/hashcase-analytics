// Quest task structure
export interface QuestTask {
  id: number;
  title: string;
  description: string;
  task_code: string;
  required_completions: number;
  reward_loyalty_points: number;
  total_completions: number;
  unique_users_completed: number;
}

// Base Quest structure
export interface Quest {
  id: number;
  title: string;
  description: string;
  collection_id: number;
  claimable_metadata: number | null;
  reward_token_id: number | null;
  reward_token_amount: number | null;
  is_active: boolean;
  created_at: string;
  total_task_completions: number;
  unique_users_interacted: number;
  users_completed_quest: number;
  rewards_claimed: number;
  tasks: QuestTask[];
}

// Top 3 Quests with rank
export interface TopQuest extends Quest {
  rank: 1 | 2 | 3;
}

// Full API response structure
export interface QuestCollectionResponse {
  collection_id: number;
  top_3_by_interactions: TopQuest[];
  all_quests: Quest[];
}
