export interface User {
    id: string;
    name: string;
    email: string;
    role: string; // e.g., 'admin', 'user', etc.
    createdAt: Date; // ISO date string
    isEmailVerified: boolean;
    updatedAt: Date;
    profilePicture?: string;
}



export interface Workspace {
  _id: string;
  name: string;
  description?: string;
  owner: User | string;
  color: string;
  members: {
    user: User;
    role: "admin" | "member" | "owner" | "viewer";
    joinedAt: Date;
  }[];
  createdAt: Date;
  updatedAt: Date;
}