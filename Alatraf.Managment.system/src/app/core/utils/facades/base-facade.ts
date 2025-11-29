import { inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import {
  ApiErrorExtractor,
  ExtractedApiErrorKind,
  ExtractedApiErrorType,
} from '../api-error-extractor';
import { DialogService } from '../../../shared/components/dialog/dialog.service';
import { DialogConfig } from '../../../shared/components/dialog/DialogConfig';
import { ApiResult } from '../../models/ApiResult';
import { ToastService } from '../../services/toast.service';

export interface FacadeResult<T> {
  success: boolean;
  data?: T;
  validationErrors?: Record<string, string[]> | null;
}

export abstract class BaseFacade {
  protected toast = inject(ToastService);
  protected dialog = inject(DialogService);

  protected extractError(result: ApiResult<any>): ExtractedApiErrorType {
    return ApiErrorExtractor.extract(result);
  }

  /**
   * Wraps create/update calls with:
   * - success toast
   * - validation / business / system error handling
   * - unified FacadeResult<T> output
   *
   * Facade remains free to:
   * - clear cache
   * - update signals
   * - set formValidationErrors
   */
  protected handleCreateOrUpdate<T>(
    call$: Observable<ApiResult<T>>,
    options: {
      successMessage: string;
      defaultErrorMessage: string;
    }
  ): Observable<FacadeResult<T>> {
    return call$.pipe(
      map((result) => {
        if (result.isSuccess && result.data) {
          // Success case
          this.toast.success(options.successMessage);

          return {
            success: true,
            data: result.data,
            validationErrors: null,
          };
        }

        const err = this.extractError(result);

        // Validation error → no toast, send errors back to facade
        if (err.type === ExtractedApiErrorKind.Validation) {
          return {
            success: false,
            data: undefined,
            validationErrors: err.errors,
          };
        }

        // Business error → show backend message
        if (err.type === ExtractedApiErrorKind.Business) {
          this.toast.error(err.message);
          return {
            success: false,
            data: undefined,
            validationErrors: null,
          };
        }

        // System error → generic message
        this.toast.error(options.defaultErrorMessage);
        return {
          success: false,
          data: undefined,
          validationErrors: null,
        };
      })
    );
  }

  /**
   * Wraps delete calls with:
   * - success toast
   * - business / validation / system error handling
   *
   * Facade remains free to:
   * - clear cache
   * - reload lists
   */
  protected handleDelete(
    call$: Observable<ApiResult<any>>,
    options: {
      successMessage: string;
      defaultErrorMessage: string;
    }
  ): Observable<boolean> {
    return call$.pipe(
      map((result) => {
        if (result.isSuccess) {
          this.toast.success(options.successMessage);
          return true;
        }

        const err = this.extractError(result);

        if (
          err.type === ExtractedApiErrorKind.Business ||
          err.type === ExtractedApiErrorKind.Validation
        ) {
          this.toast.error(err.message);
        } else {
          this.toast.error(options.defaultErrorMessage);
        }

        return false;
      })
    );
  }

  /**
   * Common helper for:
   * 1) Showing confirm dialog
   * 2) Calling delete API
   * 3) Returning success boolean
   *
   * Facade decides what to do on success (reload list, clear cache, etc.)
   */
  protected confirmAndDelete(
    config: DialogConfig,
    deleteCall: () => Observable<ApiResult<any>>,
    options: {
      successMessage: string;
      defaultErrorMessage: string;
    }
  ): Observable<boolean> {
    return this.dialog.confirmDelete(config).pipe(
      switchMap((confirmed) => {
        if (!confirmed) return of(false);

        return this.handleDelete(deleteCall(), options);
      })
    );
  }
}
