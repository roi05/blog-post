export interface Posttypes {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  body: string;
  authorId: string;
  author: Authortype;
  likes: Liketypes[];
}

export interface Authortype {
  id: string;
  name: string;
  email: string;
  emailVerified: null;
  image: string;
}

export interface Liketypes {
  id: string;
  postId: string;
  userId: string;
  post: Posttypes[];
  user: Authortype;
}
