import PostEntity from "./Post";
import UserEntity from "./User";

export default interface TagEntity {
  id: string;
  posts?: PostEntity[];
  followers?: UserEntity[];
  name: string;
  color: string;
  createdAt: Date;
  updatedAt: Date;
}
