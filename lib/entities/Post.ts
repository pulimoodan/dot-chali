import { VoteType } from "@prisma/client";
import CommentEntity from "./Comment";
import LikeEntity from "./Like";
import TagEntity from "./Tag";
import UserEntity from "./User";
import VoteEntity from "./Vote";

export default interface PostEntity {
  id: string;
  content: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  user: UserEntity;
  tags?: TagEntity[];
  votes?: VoteEntity[];
  comments?: CommentEntity[];
  likes?: LikeEntity[];
}

export interface BigPostEntity {
  id: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  user: {
    id: string;
    userName: string;
    firstName: string;
    lastName: string;
    email: string;
    profilePic: string;
    following: boolean;
  };
  tags: {
    name: string;
    color: string;
  }[];
  votes: number;
  voted?: VoteType;
  comments: number;
  liked: boolean;
  popularity: number;
}
