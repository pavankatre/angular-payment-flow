import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry, timeout } from 'rxjs/operators';

/**
 * Centralized HTTP Service for all API requests
 * Provides a single point of control for HTTP operations with error handling,
 * retry logic, and timeout management
 */
@Injectable({
  providedIn: 'root'
})
export class HttpApiService {

  private readonly BASE_URL = 'https://jsonplaceholder.typicode.com';
  private readonly TIMEOUT_DURATION = 10000; // 10 seconds
  private readonly RETRY_ATTEMPTS = 1; // Retry failed requests once

  constructor(private http: HttpClient) { }

  /**
   * Generic GET request
   * @param endpoint - API endpoint path (without base URL)
   * @param params - Optional query parameters
   * @returns Observable of the HTTP response
   */
  get<T>(endpoint: string, params?: HttpParams | any): Observable<T> {
    const url = this.buildUrl(endpoint);

    return this.http.get<T>(url, { params }).pipe(
      timeout(this.TIMEOUT_DURATION),
      retry(this.RETRY_ATTEMPTS),
      catchError(this.handleError)
    );
  }

  /**
   * Generic POST request
   * @param endpoint - API endpoint path (without base URL)
   * @param body - Request body data
   * @param params - Optional query parameters
   * @returns Observable of the HTTP response
   */
  post<T>(endpoint: string, body: any, params?: HttpParams | any): Observable<T> {
    const url = this.buildUrl(endpoint);

    return this.http.post<T>(url, body, { params }).pipe(
      timeout(this.TIMEOUT_DURATION),
      catchError(this.handleError)
    );
  }

  /**
   * Generic PUT request
   * @param endpoint - API endpoint path (without base URL)
   * @param body - Request body data
   * @param params - Optional query parameters
   * @returns Observable of the HTTP response
   */
  put<T>(endpoint: string, body: any, params?: HttpParams | any): Observable<T> {
    const url = this.buildUrl(endpoint);

    return this.http.put<T>(url, body, { params }).pipe(
      timeout(this.TIMEOUT_DURATION),
      catchError(this.handleError)
    );
  }

  /**
   * Generic PATCH request
   * @param endpoint - API endpoint path (without base URL)
   * @param body - Request body data
   * @param params - Optional query parameters
   * @returns Observable of the HTTP response
   */
  patch<T>(endpoint: string, body: any, params?: HttpParams | any): Observable<T> {
    const url = this.buildUrl(endpoint);

    return this.http.patch<T>(url, body, { params }).pipe(
      timeout(this.TIMEOUT_DURATION),
      catchError(this.handleError)
    );
  }

  /**
   * Generic DELETE request
   * @param endpoint - API endpoint path (without base URL)
   * @param params - Optional query parameters
   * @returns Observable of the HTTP response
   */
  delete<T>(endpoint: string, params?: HttpParams | any): Observable<T> {
    const url = this.buildUrl(endpoint);

    return this.http.delete<T>(url, { params }).pipe(
      timeout(this.TIMEOUT_DURATION),
      catchError(this.handleError)
    );
  }

  /**
   * Build complete URL from endpoint
   * @param endpoint - API endpoint path
   * @returns Complete URL
   */
  private buildUrl(endpoint: string): string {
    // Remove leading slash if present
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
    return `${this.BASE_URL}/${cleanEndpoint}`;
  }

  /**
   * Handle HTTP errors
   * @param error - HttpErrorResponse
   * @returns Observable that throws an error
   */
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An error occurred';

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
      console.error('Client-side error:', errorMessage);
    } else {
      // Server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
      console.error('Server-side error:', errorMessage);
    }

    return throwError(() => new Error(errorMessage));
  }
}
