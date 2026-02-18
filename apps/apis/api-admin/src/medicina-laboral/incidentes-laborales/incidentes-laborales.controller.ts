import { Controller, Get, UseGuards, Query } from '@nestjs/common';
import { IncidentesLaboralesFilterDto } from './dto/incidentes-laborales-filter.dto';
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
  findAll(
    @GetCurrentUser() user: JwtPayload,
    @Query() filters: IncidentesLaboralesFilterDto,
  ) {
    return this.service.findAll(user, filters); // Passing user as JwtPayload directly
  }
}
