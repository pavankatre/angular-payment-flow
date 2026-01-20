export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  company: {
    name: string;
    catchPhrase?: string;
    bs?: string;
  };
  username?: string;
  website?: string;
  address?: any;
}

export interface UserResponse {
  users: User[];
  error: string | null;
  loading: boolean;
}
