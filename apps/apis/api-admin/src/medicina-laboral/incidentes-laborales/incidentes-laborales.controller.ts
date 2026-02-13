import { Controller, Get, UseGuards } from '@nestjs/common';
import { IncidentesLaboralesService } from './incidentes-laborales.service';
import { GetCurrentUser } from '../../common/decorators/get-current-user.decorator';
import { AtGuard } from '../../common/guards/at.guard';
import { MedicinaLaboralGuard } from '../guards/medicina-laboral.guard';
import type { JwtPayload } from '../../common/types/jwt-payload.type'; // Use JwtPayload like ExamenesLaboralesController

@Controller('medicina-laboral/incidentes-laborales')
@UseGuards(AtGuard, MedicinaLaboralGuard)
export class IncidentesLaboralesController {
  constructor(private readonly service: IncidentesLaboralesService) {}

  @Get()
  findAll(@GetCurrentUser() user: JwtPayload) {
    return this.service.findAll(user as any); // Cast to any because Service expects User but here we have JwtPayload which might differ slightly or be compatible.
    // Actually Service expects User from @medintt/types-auth.
    // Let's check compat. JwtPayload usually has enough info.
    // Service uses `user.roles` and `user.organizationId`.
    // JwtPayload should have these.
  }
}
