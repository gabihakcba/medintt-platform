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

  async sendUserConfirmation(email: string, url: string) {
    await this.mailerService.sendMail({
      to: email,
      subject: "Bienvenido a MEDINTT - Confirma tu Email",
      html: `
        <h1>Bienvenido a MEDINTT</h1>
        <p>Hola ${email},</p>
        <p>Gracias por registrarte. Por favor confirma tu correo electrónico haciendo clic en el siguiente enlace:</p>
        <p>
            <a href="${url}" style="padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">Confirmar Email</a>
        </p>
        <p>Si no funciona el botón, copia este enlace: ${url}</p>
      `,
    });
  }

  async sendPasswordReset(email: string, url: string) {
    await this.mailerService.sendMail({
      to: email,
      subject: "Recuperación de Contraseña",
      html: `
        <h1>Recuperación de contraseña</h1>
        <p>Has solicitado restablecer tu contraseña en MEDINTT.</p>
        <p>Haz clic en el siguiente enlace para continuar:</p>
        <p>
            <a href="${url}">Restablecer contraseña</a>
        </p>
        <br/>
        <p>Si no fuiste tú, ignora este correo.</p>
      `,
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
    const results: Array<{
      batchIndex: number;
      ok: boolean;
      id?: string;
      error?: string;
    }> = [];

    this.logger.log(
      `Iniciando envío masivo a ${emails.length} destinatarios en ${batches.length} lotes.`,
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
          `Lote ${index + 1}/${batches.length} enviado. ID: ${info.messageId}`,
        );
        results.push({ batchIndex: index, ok: true, id: info.messageId });
      } catch (error) {
        this.logger.error(`Error enviando lote ${index + 1}`, error);
        results.push({ batchIndex: index, ok: false, error });
      }

      // Esperar si no es el último lote
      if (index < batches.length - 1) {
        this.logger.log(
          `Esperando ${delayMinutes} minutos para el siguiente lote...`,
        );
        await this.wait(delayMs);
      }
    }

    return results;
  }

  async sendLinkMail(to: string, name: string, link: string) {
    await this.mailerService.sendMail({
      to,
      subject: "Link para llenar la declaración jurada",
      html: `
        <h1>Estimado/a ${name},</h1>
        <p>Por favor complete su declaración jurada utilizando el siguiente enlace:</p>
        <p>
            <a href="${link}" style="padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">Completar Declaración Jurada</a>
        </p>
        <p>Si no funciona el botón, copia este enlace: ${link}</p>
      `,
    });
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
