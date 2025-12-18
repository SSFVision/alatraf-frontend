// import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { ApiResult } from '../models/ApiResult';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class BaseApiService {
  protected baseUrl = environment.apiBaseUrl;

  constructor(protected http: HttpClient) {}

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

  protected createHeaders(custom?: HttpHeaders): HttpHeaders {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    if (custom) {
      custom.keys().forEach((key) => {
        headers = headers.set(key, custom.get(key)!);
      });
    }

    return headers;
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
      .pipe(catchError((err) => this.handleError(err)));
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

  protected getFullUrl<T>(fullUrl: string): Observable<ApiResult<T>> {
    return this.http
      .get<ApiResult<T>>(this.normalize(fullUrl))
      .pipe(catchError((err) => this.handleError(err)));
  }
}
