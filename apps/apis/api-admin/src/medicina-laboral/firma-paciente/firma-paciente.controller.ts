import { Body, Controller, Post, Put } from '@nestjs/common';
import { FirmaPacienteService } from './firma-paciente.service';
import { InviteRequestDto } from './dto/invite-request.dto';
import { VerifyRequestDto } from './dto/verify-request.dto';
import { GetFirmaDto } from './dto/get-firma.dto';
import { UpdateFirmaDto } from './dto/update-firma.dto';

@Controller('medicina-laboral/firma-paciente')
export class FirmaPacienteController {
  constructor(private readonly service: FirmaPacienteService) {}

  @Post('invite')
  createInvite(@Body() dto: InviteRequestDto) {
    return this.service.createInvite(dto);
  }

  @Post('verify')
  verifyIdentity(@Body() dto: VerifyRequestDto) {
    return this.service.verifyIdentity(dto);
  }

  @Post('get')
  getFirma(@Body() dto: GetFirmaDto) {
    return this.service.getFirma(dto);
  }

  @Put()
  updateFirma(@Body() dto: UpdateFirmaDto) {
    return this.service.updateFirma(dto);
  }
}
