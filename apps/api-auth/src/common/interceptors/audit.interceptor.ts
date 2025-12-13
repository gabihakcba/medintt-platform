import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuditService } from '../../audit/audit.service';
import { Request, Response } from 'express';
import { JwtPayload } from 'src/auth/types/jwt-payload.type';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  private readonly logger = new Logger(AuditInterceptor.name);

  constructor(private readonly auditService: AuditService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();

    const rawBody = request.body as unknown;
    const { method, url, ip, headers } = request;

    const action = `${method} ${url}`;

    // /api/v1/<resource> => [1][2][3]
    const resource = url.split('/')[3] || 'root';

    const sanitizedBody = this.sanitize(rawBody);

    const userAgent = headers['user-agent'] || 'unknown';

    return next.handle().pipe(
      tap((responseBody) => {
        const response = context.switchToHttp().getResponse<Response>();
        const statusCode = response.statusCode;

        const user = request.user as JwtPayload | undefined;
        let userId = user?.sub;

        if (!userId && responseBody) {
          const body = responseBody as { user: { id: string } };
          userId = body.user?.id;
        }

        const meta = {
          ip,
          userAgent,
          statusCode,
          method,
        };

        const userConnect = userId ? { connect: { id: userId } } : undefined;

        this.auditService
          .createLog({
            action: action,
            resource: resource,
            user: userConnect,
            preMod: sanitizedBody ?? undefined,
            postMod:
              statusCode >= 400 ? { error: responseBody as object } : undefined,
            meta: meta as object,
          })
          .catch((err) => {
            console.log(err);
            this.logger.error(`Error al guardar audit log para ${action}`, err);
          });
      }),
    );
  }

  private sanitize(data: unknown): object | null {
    if (!data) return null;
    if (typeof data !== 'object') return data as Record<string, any>;

    const sensitiveFields = [
      'password',
      'newPassword',
      'oldPassword',
      'twoFactorCode',
      'token',
    ];

    const copy = JSON.parse(JSON.stringify(data)) as Record<string, any>;

    Object.keys(copy).forEach((key) => {
      if (sensitiveFields.includes(key)) {
        copy[key] = '*****';
      } else if (typeof copy[key] === 'object' && copy[key] !== null) {
        copy[key] = this.sanitize(copy[key]);
      }
    });

    return copy;
  }
}
