import { Injectable, NestMiddleware, Inject, forwardRef } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

import { LogsService } from './logs.services';

@Injectable()
export class LogMiddleware implements NestMiddleware {
  constructor(
    @Inject(forwardRef(() => LogsService))
    private readonly logsService: LogsService,
  ) {}

  use(request: Request, response: Response, next: NextFunction): void {
    const { ip, method, path: url } = request;
    const userAgent = request.get('user-agent') || '';

    response.on('close', async () => {
      const { statusCode } = response;
      const contentLength = response.get('content-length');
      if (statusCode == 200) {
        /* await this.logsService.create({ user: 29, description: 'Teste' }); */
        console.log(request.route.path);
      } else {
        console.log(
          `${method} ${url} ${statusCode} ${contentLength} - ${userAgent} ${ip}`,
        );
      }
    });

    next();
  }
}
