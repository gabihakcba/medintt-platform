import { DynamicModule, Module, Global } from "@nestjs/common";
import { MailService } from "./mail.service";
import { MailerModule } from "@nestjs-modules/mailer";
import { HandlebarsAdapter } from "@nestjs-modules/mailer/dist/adapters/handlebars.adapter";

// Definimos la interfaz de las opciones que necesitamos recibir
export interface MedinttMailOptions {
  host: string;
  user: string;
  pass: string;
  from: string;
  templatesDir?: string; // Opcional, por si quieres cambiar la carpeta
}

@Global()
@Module({})
export class MedinttMailModule {
  static register(options: MedinttMailOptions): DynamicModule {
    return {
      module: MedinttMailModule,
      imports: [
        MailerModule.forRoot({
          transport: {
            host: options.host,
            secure: false, // o true segun tu proveedor
            auth: {
              user: options.user,
              pass: options.pass,
            },
          },
          defaults: {
            from: options.from,
          },
          template: {
            dir: options.templatesDir || __dirname + "/templates",
            adapter: new HandlebarsAdapter(),
            options: {
              strict: true,
            },
          },
        }),
      ],
      providers: [MailService],
      exports: [MailService], // Exportamos el servicio para que la App lo use
    };
  }
}
