import { DeclaracionJuradaResponse } from './declaracion-jurada.response';
import { PacienteResponse } from './paciente.response';
import { EmpresaResponse } from './empresa.response';

export class GetDeclaracionResponse {
  declaracion: DeclaracionJuradaResponse;
  paciente: PacienteResponse;
  empresa: EmpresaResponse;
}
