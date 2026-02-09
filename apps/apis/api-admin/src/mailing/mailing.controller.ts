import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { MailService } from '@medintt/mail';
import { SendMailingDto } from './dto/send-mailing.dto';
import { AtGuard } from '../common/guards/at.guard';
import { Medintt4Guard } from '../medintt4/guards/medintt4.guard';

@ApiTags('Mailing')
@UseGuards(AtGuard, Medintt4Guard)
@ApiBearerAuth()
@Controller('mailing')
export class MailingController {
  constructor(private mailService: MailService) {}

  @Post('send-email')
  @ApiOperation({ summary: 'Enviar email' })
  @ApiResponse({ status: 200, description: 'Email enviado correctamente' })
  @ApiResponse({ status: 400, description: 'Error al enviar el email' })
  async sendEmail(@Body() body: SendMailingDto): Promise<any> {
    // Convert string attachments to Buffer
    const options = {
      ...body.options,
      attachments: body.options.attachments?.map((attachment) => ({
        filename: attachment.filename,
        content: Buffer.from(attachment.content, 'base64'),
        contentType: attachment.contentType,
      })),
    };

    return this.mailService.sendBulkMailing(body.emails, options);
  }
}
