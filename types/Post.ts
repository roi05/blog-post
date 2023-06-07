export interface Posttypes {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  body: string;
  authorId: string;
  author: Author;
  likes: any[];
}

export interface Author {
  id: string;
  name: string;
  email: string;
  emailVerified: null;
  image: string;
}
