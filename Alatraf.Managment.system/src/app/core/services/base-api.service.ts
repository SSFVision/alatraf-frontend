// import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, delay } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { ApiResult } from '../models/ApiResult';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class BaseApiService {
  protected baseUrl = environment.apiBaseUrl;

  constructor(@Inject(HttpClient) protected http: HttpClient) {}

  // protected buildUrl(endpoint: string): string {
  //   if (!endpoint.startsWith('/')) endpoint = `/${endpoint}`;
  //   return this.normalize(`${this.baseUrl}${endpoint}`);
  // }
  protected buildUrl(endpoint: string): string {
    // If endpoint is absolute URL => use it directly (real API)
    if (endpoint.startsWith('http://') || endpoint.startsWith('https://')) {
      return this.normalize(endpoint);
    }

    // Otherwise use baseUrl => this will go to InMemory API
    if (!endpoint.startsWith('/')) {
      endpoint = '/' + endpoint;
    }

    return this.normalize(`${this.baseUrl}${endpoint}`);
  }

  protected normalize(url: string): string {
    // Remove double slashes except after http:// or https://
    return url.replace(/([^:]\/)\/+/g, '$1');
  }

  // Join URL path segments safely (no double slashes).
  protected joinUrl(...segments: Array<string | number>): string {
    const path = segments
      .filter((s) => s !== null && s !== undefined && s !== '')
      .map((s) => String(s).replace(/^\/+|\/+$/g, ''))
      .join('/');
    return path; // relative path without leading slash
  }

  protected createHeaders(custom?: HttpHeaders): HttpHeaders {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      // 'X-Enable-Loader': 'true',
    });

    if (custom) {
      custom.keys().forEach((key) => {
        headers = headers.set(key, custom.get(key)!);
      });
    }

    return headers;
  }

  // Convenience: create headers and enable loader flag.
  protected withLoader(headers?: HttpHeaders): HttpHeaders {
    return this.createHeaders(headers).set('X-Enable-Loader', 'true');
  }

  // Build HttpParams from a plain object, skipping null/undefined/empty strings.
  protected buildParams(params?: Record<string, any>): HttpParams | undefined {
    if (!params) return undefined;
    let hp = new HttpParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        hp = hp.set(key, String(value));
      }
    });
    return hp;
  }

  protected buildOptions(params?: HttpParams, headers?: HttpHeaders) {
    return {
      params,
      headers: this.createHeaders(headers),
    };
  }

  protected handleError(error: any): Observable<never> {
    // You can enhance this to send errors to a logging server
    console.error('API ERROR:', error);
    return throwError(() => error);
  }

  protected get<T>(
    endpoint: string,
    params?: HttpParams,
    headers?: HttpHeaders
  ): Observable<ApiResult<T>> {
    const url = this.buildUrl(endpoint);
    return this.http
      .get<ApiResult<T>>(url, this.buildOptions(params, headers))
      .pipe(
        catchError((err) => this.handleError(err))
        // delay(1500)
      );
  }

  // Variant: accept plain object params (auto-converted to HttpParams)
  protected getWithParams<T>(
    endpoint: string,
    paramsObj?: Record<string, any>,
    headers?: HttpHeaders
  ): Observable<ApiResult<T>> {
    return this.get<T>(endpoint, this.buildParams(paramsObj), headers);
  }

  protected post<T>(
    endpoint: string,
    body: any,
    headers?: HttpHeaders
  ): Observable<ApiResult<T>> {
    const url = this.buildUrl(endpoint);
    return this.http
      .post<ApiResult<T>>(url, body, {
        headers: this.createHeaders(headers),
      })
      .pipe(catchError((err) => this.handleError(err)));
  }

  protected put<T>(
    endpoint: string,
    body: any,
    headers?: HttpHeaders
  ): Observable<ApiResult<T>> {
    const url = this.buildUrl(endpoint);
    return this.http
      .put<ApiResult<T>>(url, body, {
        headers: this.createHeaders(headers),
      })
      .pipe(catchError((err) => this.handleError(err)));
  }
  protected patch<T>(
    endpoint: string,
    body: any,
    headers?: HttpHeaders,
    params?: HttpParams
  ): Observable<ApiResult<T>> {
    const url = this.buildUrl(endpoint);
    return this.http
      .patch<ApiResult<T>>(url, body, this.buildOptions(params, headers))
      .pipe(catchError((err) => this.handleError(err)));
  }

  protected delete<T>(
    endpoint: string,
    params?: HttpParams,
    headers?: HttpHeaders
  ): Observable<ApiResult<T>> {
    const url = this.buildUrl(endpoint);
    return this.http
      .delete<ApiResult<T>>(url, this.buildOptions(params, headers))
      .pipe(catchError((err) => this.handleError(err)));
  }

  // Some APIs require a DELETE request with a body payload. Angular supports this via request('DELETE').
  // This method preserves the existing delete() signature while enabling DELETE-with-body when needed.
  protected deleteWithBody<T>(
    endpoint: string,
    body: any,
    headers?: HttpHeaders,
    params?: HttpParams
  ): Observable<ApiResult<T>> {
    const url = this.buildUrl(endpoint);
    return this.http
      .request<ApiResult<T>>('DELETE', url, {
        headers: this.createHeaders(headers),
        body,
        params,
      })
      .pipe(catchError((err) => this.handleError(err)));
  }

  protected getFullUrl<T>(fullUrl: string): Observable<ApiResult<T>> {
    return this.http
      .get<ApiResult<T>>(this.normalize(fullUrl))
      .pipe(catchError((err) => this.handleError(err)));
  }
}
