import {
  HttpErrorResponse,
  HttpEvent,
  HttpInterceptorFn,
  HttpResponse,
} from '@angular/common/http';
import { inject } from '@angular/core';

import { catchError, delay, map, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { handleErrorResponse } from '../errors/helpers/handle-error-response';
import { handleException } from '../errors/helpers/handle-exception';
import { ApiResult } from '../models/ApiResult';
import { ToastService } from '../services/toast.service';

function isAuthEndpoint(url: string): boolean {
  return (
    url.includes('/identity/token/generate') ||
    url.includes('/identity/token/refresh-token') ||
    url.includes('/identity/current-user/claims')
  );
}
export const apiResponseInterceptor: HttpInterceptorFn = (req, next) => {
  const toast = inject(ToastService);
  if (isAuthEndpoint(req.url)) {
    return next(req);
  }
  return next(req).pipe(
    // delay(1500),
    map((event: HttpEvent<any>) => {
      if (event instanceof HttpResponse) {
        const body = event.body;
        console.log('✅ Correct Response from backend', event);
        if (req.responseType === 'blob') {
          return event;
        }
        const apiResult = ApiResult.success(event.body, event.status);
        const successMsg = req.headers.get('X-Success-Toast');
        if (successMsg) {
          // toast.success(successMsg);
        }

        return event.clone({ body: apiResult });
      }
      return event;
    }),

    catchError((error: any) => {
      console.log('⛔ error from backend ', error);

      let apiResult;
      if (error instanceof HttpErrorResponse && error.status !== 0) {
        apiResult = handleErrorResponse(error);
      } else {
        console.log('error called here');
        apiResult = handleException(error);
        if (apiResult.errorMessage) {
          toast.error(apiResult.errorMessage);
        }
      }

      if (!environment.production) {
        console.error('Intercepted API Error:', apiResult);
      }

      // Convert the error into a successful HttpResponse carrying ApiResult
      const response = new HttpResponse({
        body: apiResult,
        status: error?.status || 0,
      });

      return of(response);
    })
  );
};
