import { ApiResult } from '../models/ApiResult';


export enum ExtractedApiErrorKind {
  Validation = 'validation',
  Business = 'business',
  System = 'system',
}


export type ExtractedApiErrorType =
  | { type: ExtractedApiErrorKind.Validation; errors: Record<string, string[]>; message: string }
  | { type: ExtractedApiErrorKind.Business; message: string }
  | { type: ExtractedApiErrorKind.System };

export class ApiErrorExtractor {
  static extract(result: ApiResult<any>): ExtractedApiErrorType {
    // 1️⃣ Validation (400)
    if (result.statusCode === 400 && result.validationErrors) {
      const firstField = Object.keys(result.validationErrors)[0];
      const firstMessage = result.validationErrors[firstField][0];

      return {
        type: ExtractedApiErrorKind.Validation,
        errors: result.validationErrors,
        message: firstMessage,
      };
    }

    // 2️⃣ Business errors
    if (result.errorMessage) {
      return {
        type: ExtractedApiErrorKind.Business,
        message: result.errorDetail ?? result.errorMessage,
      };
    }

    // 3️⃣ System / Unknown
    return { type: ExtractedApiErrorKind.System };
  }
}

