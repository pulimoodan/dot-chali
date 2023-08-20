import PostEntity from "./Post";
import UserEntity from "./User";

export default interface LikeEntity {
  id: string;
  user?: UserEntity;
  post?: PostEntity;
  createdAt: Date;
  updatedAt: Date;
}
