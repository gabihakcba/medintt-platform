export interface InvitePayload {
  did: number;
  typ: 'invite';
  v: number;
  n: string;
  exp: number;
}

export interface ProofPayload {
  did: number;
  typ: 'proof';
  v: number;
  n: string;
  exp: number;
  dnih: string;
}
