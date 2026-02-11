import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Medintt4Service } from './medintt4.service';

@ApiTags('Medintt4')
@Controller('medintt4')
export class Medintt4Controller {
  constructor(private readonly medintt4Service: Medintt4Service) {}

  @Get('health')
  @ApiOperation({ summary: 'Check Medintt4 Database Health' })
  @ApiResponse({ status: 200, description: 'Database status' })
  async checkHealth() {
    return this.medintt4Service.checkHealth();
  }
}
