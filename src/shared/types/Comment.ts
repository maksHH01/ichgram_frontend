export interface Comment {
  _id: string;
  author: {
    username: string;
    avatarUrl: string;
  };
  text: string;
  likes: Array<string | { _id: string; username?: string; avatarUrl?: string }>;
  createdAt: string;
}
