import { Controller, Post, Body, Put } from '@nestjs/common';
import { DeclaracionJuradaService } from './declaracion-jurada.service';
import { InviteRequestDto } from './dto/invite-request.dto';
import { VerifyRequestDto } from './dto/verify-request.dto';
import { GetDeclaracionBodyDto } from './dto/get-declaracion-body.dto';
import { UpdateByProofDto } from './dto/update-by-proof.dto';

@Controller('medicina-laboral/declaracion-jurada')
export class DeclaracionJuradaController {
  constructor(
    private readonly declaracionJuradaService: DeclaracionJuradaService,
  ) {}

  @Post('invite')
  createInvite(@Body() dto: InviteRequestDto) {
    return this.declaracionJuradaService.createInvite(dto);
  }

  @Post('verify')
  verifyIdentity(@Body() dto: VerifyRequestDto) {
    return this.declaracionJuradaService.verifyIdentity(dto);
  }

  @Post('get')
  getByProof(@Body() dto: GetDeclaracionBodyDto) {
    return this.declaracionJuradaService.getByProof(dto);
  }

  // Supporting both PUT / (with proof body) and PUT /:token (legacy)
  // Since we cannot easily overload PUT / with different DTOs effectively without validation pipes clashing,
  // we will assume PUT / uses proof + update data.
  // Although requirements said "PUT /declaracion-jurada debe aceptar proof en el body".
  // The DTO `UpdateDeclaracionDto` contains the form data. I need a wrapper or intersection type if I want strict validation,
  // or I can ask the user to send `proof` inside the body along with other fields.
  // Let's modify `UpdateDeclaracionDto`? No, let's keep it clean.
  // I'll create a new method that handles PUT root.

  @Put()
  updateByProof(@Body() body: UpdateByProofDto) {
    return this.declaracionJuradaService.updateByProof(body.proof, body.data);
  }
}
