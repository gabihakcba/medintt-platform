import { GetDeclaracionResponse } from './get-declaracion.response';

export class VerifyResponseDto {
  proof: string;
  proofExpiresAt: number;
  ddjj: GetDeclaracionResponse;
}
