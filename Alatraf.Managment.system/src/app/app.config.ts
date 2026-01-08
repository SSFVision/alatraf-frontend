import {
  APP_INITIALIZER,
  ApplicationConfig,
  ErrorHandler,
  provideZoneChangeDetection,
} from '@angular/core';
import {
  provideRouter,
  withComponentInputBinding,
  withRouterConfig,
} from '@angular/router';

import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { APP_ROUTES } from './app.routes';
import { AuthFacade } from './core/auth/auth.facade';
import { authInitializer } from './core/auth/auth.initializer.service';
import { GlobalErrorHandler } from './core/errors/global-error-handler';
import { apiResponseInterceptor } from './core/interceptors/api-response.interceptor';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { loadingInterceptor } from './core/interceptors/loading.interceptor';
import { SkeletonLoadingInterceptor } from './core/interceptors/skeleteon-loading.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: authInitializer,
      deps: [AuthFacade],
      multi: true,
    },
    {
      provide: ErrorHandler,
      useClass: GlobalErrorHandler,
    },

    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(
      APP_ROUTES,
      withComponentInputBinding(),
      withRouterConfig({
        paramsInheritanceStrategy: 'always',
      })
    ),
    provideHttpClient(
      withInterceptors([
        SkeletonLoadingInterceptor,
        loadingInterceptor,
        apiResponseInterceptor,
        authInterceptor,
      ])
    ),
  ],
};
