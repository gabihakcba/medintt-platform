import {
  Controller,
  Get,
  UseGuards,
  Query,
  Param,
  ParseIntPipe,
  Res,
} from '@nestjs/common';
import type { Response } from 'express';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiQuery,
} from '@nestjs/swagger';
import { AusentismosService } from './ausentismos.service';
import { AtGuard } from '../../common/guards/at.guard';
import { MedicinaLaboralGuard } from '../guards/medicina-laboral.guard';
import { GetCurrentUser } from '../../common/decorators/get-current-user.decorator';
import type { JwtPayload } from '../../common/types/jwt-payload.type';
import { AusentismosFilterDto } from './dto/ausentismos-filter.dto';
import {
  ExcelExportService,
  ExcelColumn,
} from '../../common/services/excel-export.service';

@ApiTags('Medicina Laboral - Ausentismos')
@Controller('medicina-laboral/ausentismos')
@UseGuards(AtGuard, MedicinaLaboralGuard)
@ApiBearerAuth()
export class AusentismosController {
  constructor(
    private readonly ausentismosService: AusentismosService,
    private readonly excelExportService: ExcelExportService,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Get all ausentismos',
    description:
      'Returns all ausentismos if SuperAdmin or Admin of medicina-laboral in medintt org. Returns only ausentismos from user organization if Interlocutor.',
  })
  @ApiQuery({ name: 'desde', required: false, type: String })
  @ApiQuery({ name: 'hasta', required: false, type: String })
  @ApiQuery({ name: 'mesReferencia', required: false, type: String })
  @ApiResponse({ status: 200, description: 'List of ausentismos' })
  async findAll(
    @GetCurrentUser() user: JwtPayload,
    @Query() filters: AusentismosFilterDto,
  ) {
    return this.ausentismosService.findAll(user, filters);
  }

  @Get('export/excel')
  @ApiOperation({ summary: 'Export ausentismos to Excel' })
  async exportExcel(
    @GetCurrentUser() user: JwtPayload,
    @Query() filters: AusentismosFilterDto,
    @Res() res: Response,
  ) {
    const { data } = await this.ausentismosService.findAll(user, filters, true);

    const columns: ExcelColumn[] = [
      { header: 'Apellido', key: 'Apellido', width: 20 },
      { header: 'Nombre', key: 'Nombre', width: 20 },
      { header: 'DNI', key: 'DNI', width: 15 },
      { header: 'Empresa', key: 'Empresa', width: 25 },
      { header: 'Desde', key: 'Fecha_Desde', width: 15 },
      { header: 'Hasta', key: 'Fecha_Hasta', width: 15 },
      { header: 'Reincorporación', key: 'Fecha_Reincoporacion', width: 15 },
      { header: 'Diagnóstico', key: 'Diagnostico', width: 30 },
      { header: 'Evolución', key: 'Evolucion', width: 30 },
      { header: 'Categoría', key: 'Categoria', width: 20 },
      { header: 'Adjuntos', key: 'Adjuntos', width: 10 },
      { header: 'Certificados', key: 'Certificados', width: 10 },
    ];

    type AusentismoExportData = {
      paciente: {
        Apellido: string | null;
        Nombre: string | null;
        NroDocumento: string | null;
      } | null;
      prestataria: { Nombre: string | null } | null;
      Fecha_Desde: Date | null;
      Fecha_Hasta: Date | null;
      Fecha_Reincoporacion: Date | null;
      Diagnostico: string | null;
      Evolucion: string | null;
      Ausentismos_Categorias: { Categoria: string | null } | null;
      Ausentismos_Attachs: { length: number }[];
      Ausentismos_Certificados: { length: number }[];
    };

    const excelData = (data as unknown as AusentismoExportData[]).map((a) => ({
      Apellido: a.paciente?.Apellido,
      Nombre: a.paciente?.Nombre,
      DNI: a.paciente?.NroDocumento,
      Empresa: a.prestataria?.Nombre,
      Fecha_Desde: a.Fecha_Desde
        ? new Date(a.Fecha_Desde).toISOString().split('T')[0]
        : '',
      Fecha_Hasta: a.Fecha_Hasta
        ? new Date(a.Fecha_Hasta).toISOString().split('T')[0]
        : '',
      Fecha_Reincoporacion: a.Fecha_Reincoporacion
        ? new Date(a.Fecha_Reincoporacion).toISOString().split('T')[0]
        : '',
      Diagnostico: a.Diagnostico,
      Evolucion: a.Evolucion,
      Categoria: a.Ausentismos_Categorias?.Categoria,
      Adjuntos: a.Ausentismos_Attachs?.length || 0,
      Certificados: a.Ausentismos_Certificados?.length || 0,
    }));

    await this.excelExportService.generateExcel(
      res,
      excelData,
      columns,
      'Ausentismos',
      'ausentismos',
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get ausentismo by id' })
  @ApiResponse({ status: 200, description: 'Ausentismo details' })
  async findOne(
    @GetCurrentUser() user: JwtPayload,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.ausentismosService.findOne(id, user);
  }

  @Get('attachment/:id')
  @ApiOperation({ summary: 'Get attachment content' })
  async getAttachment(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response,
  ) {
    const file = await this.ausentismosService.getAttachment(id);
    res.set({
      'Content-Type': file.mimeType || 'application/pdf',
      'Content-Disposition': `inline; filename="${file.fileName}"`,
      'Content-Length': file.buffer.length.toString(),
    });
    res.end(file.buffer);
  }

  @Get('certificate/:id')
  @ApiOperation({ summary: 'Get certificate content' })
  async getCertificate(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response,
  ) {
    const file = await this.ausentismosService.getCertificate(id);
    res.set({
      'Content-Type': file.mimeType,
      'Content-Disposition': `inline; filename="${file.fileName}"`,
      'Content-Length': file.buffer.length.toString(),
    });
    res.end(file.buffer);
  }
}
