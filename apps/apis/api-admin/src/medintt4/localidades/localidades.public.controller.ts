import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LocalidadesService } from './localidades.service';

@ApiTags('Medintt4 Localidades Public')
@Controller('medintt4/public/localidades')
export class LocalidadesPublicController {
  constructor(private readonly localidadesService: LocalidadesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all Localidades from Medintt4 (Public)' })
  @ApiResponse({ status: 200, description: 'List of Localidades' })
  async findAll() {
    return this.localidadesService.findAll();
  }
}
