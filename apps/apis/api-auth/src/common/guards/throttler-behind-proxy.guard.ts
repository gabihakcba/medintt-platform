import { ThrottlerGuard } from '@nestjs/throttler';
import { Injectable } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class MedinttThrottlerGuard extends ThrottlerGuard {
  protected async getTracker(req: Record<string, any>): Promise<string> {
    const expressRequest = req as unknown as Request;

    return (
      // eslint-disable-next-line @typescript-eslint/await-thenable
      ((await expressRequest.ips?.length)
        ? expressRequest.ips[0]
        : expressRequest.ip) || ''
    );
  }

  protected errorMessage = 'Has excedido el límite de peticiones.';
}
