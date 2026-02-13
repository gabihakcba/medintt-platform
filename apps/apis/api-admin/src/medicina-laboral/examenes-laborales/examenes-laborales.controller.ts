import {
  Controller,
  Get,
  Query,
  UseGuards,
  Param,
  Res,
  ParseIntPipe,
} from '@nestjs/common';
import { ExamenesLaboralesService } from './examenes-laborales.service';
import { AtGuard } from '../../common/guards/at.guard';
import { MedicinaLaboralGuard } from '../guards/medicina-laboral.guard';
import { GetCurrentUser } from '../../common/decorators/get-current-user.decorator';
import type { JwtPayload } from '../../common/types/jwt-payload.type';
import type { Response } from 'express';
import { Readable } from 'stream';

@Controller('medicina-laboral/examenes-laborales')
@UseGuards(AtGuard, MedicinaLaboralGuard)
export class ExamenesLaboralesController {
  constructor(
    private readonly examenesLaboralesService: ExamenesLaboralesService,
  ) {}

  @Get()
  async findAll(
    @GetCurrentUser() user: JwtPayload,
    @Query('pacienteId') pacienteId?: string,
  ) {
    return this.examenesLaboralesService.findAll(
      user,
      pacienteId ? Number(pacienteId) : undefined,
    );
  }

  @Get('attachment/:id')
  async getAttachment(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response,
  ) {
    const attachment = await this.examenesLaboralesService.getAttachment(id);

    res.set({
      'Content-Type': attachment.mimeType,
      'Content-Disposition': `inline; filename="${attachment.fileName}"`,
    });

    const stream = new Readable();
    stream.push(attachment.buffer);
    stream.push(null);

    stream.pipe(res);
  }
}
