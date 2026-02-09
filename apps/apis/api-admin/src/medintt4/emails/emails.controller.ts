import { Controller, Get, UseGuards, Query } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { EmailsService } from './emails.service';
import { Medintt4Guard } from '../guards/medintt4.guard';
import { AtGuard } from '../../common/guards/at.guard';
import { GetPacientesEmailsDto } from './dto/get-pacientes-emails.dto';

@ApiTags('Medintt4 Emails')
@Controller('medintt4/emails')
@UseGuards(AtGuard, Medintt4Guard)
@ApiBearerAuth()
export class EmailsController {
  constructor(private readonly emailsService: EmailsService) {}

  @Get('empresas')
  @ApiOperation({ summary: 'Get emails for Empresas from Medintt4' })
  @ApiResponse({ status: 200, description: 'List of Empresas with emails' })
  async getEmpresas() {
    return this.emailsService.getEmpresasEmails();
  }

  @Get('art')
  @ApiOperation({ summary: 'Get emails for ART from Medintt4' })
  @ApiResponse({ status: 200, description: 'List of ART with emails' })
  async getArt() {
    return this.emailsService.getArtEmails();
  }

  @Get('pacientes')
  @ApiOperation({ summary: 'Get emails for Pacientes from Medintt4' })
  @ApiResponse({ status: 200, description: 'List of Pacientes with emails' })
  async getPacientes(@Query() query: GetPacientesEmailsDto) {
    return this.emailsService.getPacientesEmails(query);
  }
}
