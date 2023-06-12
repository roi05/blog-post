export interface Like {
  id: string;
  postId: string;
  userId: string;
  user: UserPostTypes;
}

export interface PostTypes {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  body: string;
  authorId: string;
  author: UserPostTypes;
  likes: Like[];
}

export interface UserPostTypes {
  id: string;
  name: string;
  email: string;
  emailVerified: null;
  image: string;
  posts?: PostTypes[];
}
