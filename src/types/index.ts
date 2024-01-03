export type TUser = {
  id: string;
  email: string;
  iat: number;
  exp: number;
};

export type TNewPost = {
  creator: string;
  caption: string;
  imageUrl: string | null;
  location: string;
  tags: string[];
  likes?: string[];
  save?: string[];
};

export type TUpdatePost = Partial<TNewPost>;
