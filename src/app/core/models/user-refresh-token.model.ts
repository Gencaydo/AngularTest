export interface UserRefreshToken {
  id: number;
  userId: string;
  token: string;
  expires: string;
  created: string;
  revoked: string | null;
  isExpired: boolean;
  isRevoked: boolean;
  isActive: boolean;
}
