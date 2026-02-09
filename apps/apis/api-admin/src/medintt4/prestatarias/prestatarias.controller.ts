import { Controller, Get, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { PrestatariasService } from './prestatarias.service';
import { Medintt4Guard } from '../guards/medintt4.guard';
import { AtGuard } from '../../common/guards/at.guard';

@ApiTags('Medintt4 Prestatarias')
@Controller('medintt4/prestatarias')
@UseGuards(AtGuard, Medintt4Guard)
@ApiBearerAuth()
export class PrestatariasController {
  constructor(private readonly prestatariasService: PrestatariasService) {}

  @Get()
  @ApiOperation({ summary: 'Get all Prestatarias from Medintt4' })
  @ApiResponse({ status: 200, description: 'List of Prestatarias' })
  async findAll() {
    return this.prestatariasService.findAll();
  }
}
