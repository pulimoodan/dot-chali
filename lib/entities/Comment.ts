import PostEntity from "./Post";
import UserEntity from "./User";

export default interface CommentEntity {
  id: string;
  content: string;
  user?: UserEntity;
  post?: PostEntity;
  createdAt: Date;
  updatedAt: Date;
}
