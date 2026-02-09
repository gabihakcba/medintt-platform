import { Controller, Get, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { PacientesService } from './pacientes.service';
import { AtGuard } from '../../common/guards/at.guard';
import { MedicinaLaboralGuard } from '../guards/medicina-laboral.guard';
import { GetCurrentUser } from '../../common/decorators/get-current-user.decorator';
import type { JwtPayload } from '../../common/types/jwt-payload.type';

@ApiTags('Medicina Laboral - Pacientes')
@Controller('medicina-laboral/pacientes')
@UseGuards(AtGuard, MedicinaLaboralGuard)
@ApiBearerAuth()
export class PacientesController {
  constructor(private readonly pacientesService: PacientesService) {}

  @Get()
  @ApiOperation({
    summary: 'Get all patients',
    description:
      'Returns all patients if SuperAdmin or Admin of medicina-laboral in medintt org. Returns only patients from user organization if Interlocutor.',
  })
  @ApiResponse({ status: 200, description: 'List of patients' })
  async findAll(@GetCurrentUser() user: JwtPayload) {
    return this.pacientesService.findAll(user);
  }
}
