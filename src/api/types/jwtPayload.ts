export type UserPayload = {
  sub: string;      // email
  id: number;
  name: string;
  username: string;
  role: string;
  iat: number;
  exp: number;
}; 