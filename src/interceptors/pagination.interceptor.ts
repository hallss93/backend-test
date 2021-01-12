import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class PaginationInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    console.log('Before...');
    const request = context.switchToHttp().getRequest();
    const { query } = request;
    const newPage = !isNaN(query.page) ? Number(query.page) : 1;
    const newSize = !isNaN(query.size) ? Number(query.size) : 10;

    context.switchToHttp().getRequest().query = {
      page: newPage,
      size: newSize,
    };
    return next.handle().pipe(
      map((data) => {
        const totalPages = Math.round(data[1] / newSize);
        return {
          statusCode: context.switchToHttp().getResponse().statusCode,
          data: data[0],
          pagination: {
            page: newPage,
            size: newSize,
            totalItens: data[1],
            totalPages,
            nextPage: newPage < totalPages ? newPage + 1 : null,
            previousPage: newPage > 0 ? newPage - 1 : null,
          },
        };
      }),
    );
  }
}
