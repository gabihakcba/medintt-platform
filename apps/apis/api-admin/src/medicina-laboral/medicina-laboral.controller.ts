import { Controller, Get, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { MedicinaLaboralService } from './medicina-laboral.service';
import { AtGuard } from '../common/guards/at.guard';

@ApiTags('Medicina Laboral')
@Controller('medicina-laboral')
@UseGuards(AtGuard)
@ApiBearerAuth()
export class MedicinaLaboralController {
  constructor(
    private readonly medicinaLaboralService: MedicinaLaboralService,
  ) {}

  @Get('health')
  @ApiOperation({ summary: 'Health check for Medicina Laboral module' })
  @ApiResponse({ status: 200, description: 'Module is healthy' })
  getHealth() {
    return this.medicinaLaboralService.getHealth();
  }

  @Get('prestatarias')
  @ApiOperation({ summary: 'Get all Prestatarias for filters' })
  @ApiResponse({ status: 200, description: 'List of all Prestatarias' })
  getPrestatarias() {
    return this.medicinaLaboralService.getPrestatarias();
  }
}
