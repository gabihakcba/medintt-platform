import { Body, Controller, Patch } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PacientesService } from './pacientes.service';
import { UpdatePacienteDto } from './dto/update-paciente.dto';

@ApiTags('Medintt4 Pacientes')
@Controller('medintt4/pacientes')
export class PacientesController {
  constructor(private readonly pacientesService: PacientesService) {}

  @Patch()
  @ApiOperation({ summary: 'Update Paciente data using Proof Token' })
  @ApiResponse({ status: 200, description: 'Paciente updated successfully' })
  @ApiResponse({ status: 401, description: 'Invalid or expired token' })
  async update(@Body() dto: UpdatePacienteDto) {
    return this.pacientesService.update(dto);
  }
}
