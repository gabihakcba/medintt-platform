import { DynamicModule, Module, Global } from "@nestjs/common";
import { MailService } from "./mail.service";
import { MailerModule } from "@nestjs-modules/mailer";
import { HandlebarsAdapter } from "@nestjs-modules/mailer/dist/adapters/handlebars.adapter";

export interface MedinttMailOptions {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  pass: string;
  senderName: string;
  senderEmail: string;
  templatesDir?: string;
}

export interface MedinttMailAsyncOptions {
  imports?: any[];
  inject?: any[];
  useFactory: (
    ...args: any[]
  ) => Promise<MedinttMailOptions> | MedinttMailOptions;
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
            port: options.port,
            secure: options.secure,
            auth: {
              user: options.user,
              pass: options.pass,
            },
          },
          defaults: {
            from: `"${options.senderName}" <${options.senderEmail}>`,
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
      exports: [MailService],
    };
  }

  static registerAsync(options: MedinttMailAsyncOptions): DynamicModule {
    return {
      module: MedinttMailModule,
      imports: [
        ...(options.imports || []),
        MailerModule.forRootAsync({
          imports: options.imports || [],
          inject: options.inject || [],
          useFactory: async (...args: any[]) => {
            const config = await options.useFactory(...args);
            return {
              transport: {
                host: config.host,
                port: config.port,
                secure: config.secure,
                auth: {
                  user: config.user,
                  pass: config.pass,
                },
              },
              defaults: {
                from: `"${config.senderName}" <${config.senderEmail}>`,
              },
              template: {
                dir: __dirname + "/templates",
                adapter: new HandlebarsAdapter(),
                options: { strict: true },
              },
            };
          },
        }),
      ],
      providers: [MailService],
      exports: [MailService],
    };
  }
}
