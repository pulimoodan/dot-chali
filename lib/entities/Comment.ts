export default interface CommentEntity {
  id: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    userName: string;
    profilePic: string | null;
  };
}
