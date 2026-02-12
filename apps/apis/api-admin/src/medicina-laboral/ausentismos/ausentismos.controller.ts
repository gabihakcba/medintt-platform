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

@ApiTags('Medicina Laboral - Ausentismos')
@Controller('medicina-laboral/ausentismos')
@UseGuards(AtGuard, MedicinaLaboralGuard)
@ApiBearerAuth()
export class AusentismosController {
  constructor(private readonly ausentismosService: AusentismosService) {}

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
