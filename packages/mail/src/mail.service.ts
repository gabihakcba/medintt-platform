// mail.service.ts
import { Injectable, Logger } from "@nestjs/common";
import { MailerService } from "@nestjs-modules/mailer";

export interface BulkMailOptions {
  subject: string;
  body: string;
  attachments?: { filename: string; content: Buffer; contentType: string }[];
}

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  private readonly DEFAULT_BATCH_SIZE = 50;
  private readonly DEFAULT_DELAY_MINUTES = 3;

  constructor(private mailerService: MailerService) {}

  async sendUserConfirmation(email: string, token: string) {
    const url = `https://medintt.com/auth/confirm?token=${token}`;

    await this.mailerService.sendMail({
      to: email,
      subject: "Bienvenido a MEDINTT - Confirma tu Email",
      template: "./confirmation", // Nombre del archivo .hbs
      context: {
        name: email,
        url,
      },
    });
  }

  async sendPasswordReset(email: string, token: string) {
    const url = `https://medintt.com/auth/reset-password?token=${token}`;

    await this.mailerService.sendMail({
      to: email,
      subject: "Recuperación de Contraseña",
      template: "./reset-password",
      context: {
        url,
      },
    });
  }

  async sendBulkMailing(emails: string[], options: BulkMailOptions) {
    if (!emails || emails.length === 0) {
      throw new Error("No hay destinatarios para el envío masivo.");
    }

    const batchSize =
      Number(process.env.MAILING_BCC_BATCH_SIZE) || this.DEFAULT_BATCH_SIZE;
    const delayMinutes =
      Number(process.env.MAILING_BCC_DELAY_MINUTES) ||
      this.DEFAULT_DELAY_MINUTES;
    const delayMs = delayMinutes * 60 * 1000;

    const batches = this.chunkArray(emails, batchSize);
    const results = [];

    this.logger.log(
      `Iniciando envío masivo a ${emails.length} destinatarios en ${batches.length} lotes.`
    );


    for (const [index, batch] of batches.entries()) {
      try {
        const info = await this.mailerService.sendMail({
          bcc: batch,
          subject: options.subject,
          text: options.body,
          html: options.body,
          attachments: options.attachments,
        });

        this.logger.log(
          `Lote ${index + 1}/${batches.length} enviado. ID: ${info.messageId}`
        );
        results.push({ batchIndex: index, ok: true, id: info.messageId });
      } catch (error) {
        this.logger.error(`Error enviando lote ${index + 1}`, error);
        results.push({ batchIndex: index, ok: false, error });
      }

      // Esperar si no es el último lote
      if (index < batches.length - 1) {
        this.logger.log(
          `Esperando ${delayMinutes} minutos para el siguiente lote...`
        );
        await this.wait(delayMs);
      }
    }

    return results;
  }

  // --- HELPERS PRIVADOS (Tu lógica de utils) ---

  private chunkArray<T>(items: T[], size: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < items.length; i += size) {
      chunks.push(items.slice(i, i + size));
    }
    return chunks;
  }

  private wait(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
