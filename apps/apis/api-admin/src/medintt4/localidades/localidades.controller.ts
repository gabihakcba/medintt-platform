import { Controller, Get, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { LocalidadesService } from './localidades.service';
import { Medintt4Guard } from '../guards/medintt4.guard';
import { AtGuard } from '../../common/guards/at.guard';

@ApiTags('Medintt4 Localidades')
@Controller('medintt4/localidades')
@UseGuards(AtGuard, Medintt4Guard)
@ApiBearerAuth()
export class LocalidadesController {
  constructor(private readonly localidadesService: LocalidadesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all Localidades from Medintt4' })
  @ApiResponse({ status: 200, description: 'List of Localidades' })
  async findAll() {
    return this.localidadesService.findAll();
  }
}
