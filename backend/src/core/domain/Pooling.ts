export interface Pool {
  id: string;
  year: number;
  createdAt: Date;
}

export interface PoolMember {
  poolId: string;
  shipId: string;
  cbBefore: number;
  cbAfter: number;
}

export interface CreatePoolRequest {
  year: number;
  shipIds: string[];
}

export interface CreatePoolResult {
  poolId: string;
  members: PoolMember[];
  poolSum: number;
  valid: boolean;
}

