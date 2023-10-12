import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Next,
  Res,
  RequestTimeoutException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Observable, TimeoutError, throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import { v4 as uuidv4 } from 'uuid';
import { catchError, timeout } from 'rxjs/operators';
import { User, UserRole } from '@prisma/client';
import { ActionAdminService } from 'src/models/action-admin/action-admin.service';

export interface Response<T> {
  // data: T;
}

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  constructor(
    private readonly actionAdminService: ActionAdminService
  ) { }
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    const request = context.switchToHttp().getRequest();
    const { ip, method, originalUrl, body } = request;
    return next.handle().pipe(
      map(async (response) => {
        // save log action of Admin
        const requestId = uuidv4();
        const user: User = request?.user?.data;
        const role: UserRole = user?.userRole;
        if (user && role && role === UserRole.ADMIN && method != 'GET') {
          await this.actionAdminService.create({
            data: {
              action: originalUrl,
              actionKey: requestId,
              actionBody: body,
              userAdminId: user.id,
              ip,
            },
          });
        }

        return {
          statusCode: 200,
          messages: response?.message || 'Success',
          success: true,
          data: response || {},
        };
      }),
      timeout(50000),
      catchError((err) => {
        if (err instanceof TimeoutError) {
          return throwError(() => new RequestTimeoutException());
        }
        return throwError(() => err);
      }),
    );
  }
}
