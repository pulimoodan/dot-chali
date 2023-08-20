import PostEntity from "./Post";
import UserEntity from "./User";

export default interface VoteEntity {
  id: string;
  voteType: VoteType;
  user?: UserEntity;
  userId: string | null;
  post?: PostEntity;
  postId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export type VoteType = "great" | "good" | "ok" | "bad";
