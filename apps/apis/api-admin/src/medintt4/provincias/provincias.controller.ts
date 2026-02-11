import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ProvinciasService } from './provincias.service';

@ApiTags('Medintt4 Provincias')
@Controller('medintt4/provincias')
export class ProvinciasController {
  constructor(private readonly provinciasService: ProvinciasService) {}

  @Get()
  @ApiOperation({ summary: 'Get all Provincias from Medintt4 (Public)' })
  @ApiResponse({ status: 200, description: 'List of Provincias' })
  async findAll() {
    return this.provinciasService.findAll();
  }
}
