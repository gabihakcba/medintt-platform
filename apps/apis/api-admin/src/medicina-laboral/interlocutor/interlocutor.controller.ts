import { Controller, Get, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { InterlocutorService } from './interlocutor.service';
import { AtGuard } from '../../common/guards/at.guard';
import { MedicinaLaboralGuard } from '../guards/medicina-laboral.guard';
import { GetCurrentUser } from '../../common/decorators/get-current-user.decorator';
import type { JwtPayload } from '../../common/types/jwt-payload.type';

@ApiTags('Medicina Laboral - Interlocutor')
@Controller('medicina-laboral/interlocutor')
@UseGuards(AtGuard, MedicinaLaboralGuard)
@ApiBearerAuth()
export class InterlocutorController {
  constructor(private readonly interlocutorService: InterlocutorService) {}

  @Get('self')
  @ApiOperation({
    summary: 'Get current user interlocutor information',
    description:
      'Returns the interlocutor information for the authenticated user',
  })
  @ApiResponse({ status: 200, description: 'Interlocutor information' })
  async getSelf(@GetCurrentUser() user: JwtPayload) {
    return this.interlocutorService.getSelf(user);
  }
}
