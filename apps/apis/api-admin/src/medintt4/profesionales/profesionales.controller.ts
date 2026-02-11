import { Controller, Get, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ProfesionalesService } from './profesionales.service';
import { Medintt4Guard } from '../guards/medintt4.guard';
import { AtGuard } from '../../common/guards/at.guard';

@ApiTags('Medintt4 Profesionales')
@Controller('medintt4/profesionales')
@UseGuards(AtGuard, Medintt4Guard)
@ApiBearerAuth()
export class ProfesionalesController {
  constructor(private readonly profesionalesService: ProfesionalesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all Profesionales from Medintt4' })
  @ApiResponse({ status: 200, description: 'List of Profesionales' })
  async findAll() {
    return this.profesionalesService.findAll();
  }
}
