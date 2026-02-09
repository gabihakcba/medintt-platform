import { Injectable } from '@nestjs/common';

@Injectable()
export class MedicinaLaboralService {
  getHealth() {
    return {
      status: 'ok',
      module: 'medicina-laboral',
      timestamp: new Date().toISOString(),
    };
  }
}
