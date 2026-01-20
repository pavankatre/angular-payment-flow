import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, of } from 'rxjs';
import { LoginCredentials, AuthUser, AuthResponse, UserRole } from '../models/login.model';
import { AuthStoreService } from './auth-store.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public auth$ = this.authStore.auth$;

  constructor(
    private http: HttpClient,
    private authStore: AuthStoreService
  ) { }

  /**
   * Login user with credentials
   */
  login(credentials: LoginCredentials): Observable<AuthResponse> {
    // Set loading state
    this.authStore.setLoading(true);
    this.authStore.setError(null);

    // Mock API call - replace with actual API endpoint
    return this.mockLogin(credentials).pipe(
      tap((response: AuthResponse) => {
        this.authStore.setLoading(false);
        
        if (response.success) {
          // Update store with successful login
          this.authStore.updateLoginState(response.user, response.token);
        } else {
          // Set error message
          this.authStore.setError(response.message);
        }
      })
    );
  }

  /**
   * Mock login function (replace with actual API call)
   */
  private mockLogin(credentials: LoginCredentials): Observable<AuthResponse> {
    // Validate credentials using store service
    const isValid = this.authStore.validateCredentials(credentials);
    
    if (isValid) {
      const user = this.authStore.getMockUserByUsername(credentials.username);
      if (user) {
        const response: AuthResponse = {
          user: user,
          token: 'mock_token_' + Date.now(),
          message: 'Login successful',
          success: true
        };
        return of(response);
      }
    }

    const response: AuthResponse = {
      user: null as any,
      token: '',
      message: 'Invalid credentials',
      success: false
    };

    return of(response);
  }

  /**
   * Logout user
   */
  logout(): void {
    this.authStore.clearAllState();
  }

  /**
   * Get current user
   */
  getCurrentUser(): AuthUser | null {
    return this.authStore.getCurrentUser();
  }

  /**
   * Get current user signal
   */
  getCurrentUserSignal() {
    return this.authStore.getCurrentUserSignal();
  }

  /**
   * Check if user is authenticated
   */
  isLoggedIn(): boolean {
    return this.authStore.isLoggedIn();
  }

  /**
   * Get authentication signal
   */
  getAuthSignal() {
    return this.authStore.getAuthSignal();
  }

  /**
   * Get user role
   */
  getUserRole(): UserRole | null {
    return this.authStore.getUserRole();
  }

  /**
   * Get user role signal
   */
  getUserRoleSignal() {
    return this.authStore.getUserRoleSignal();
  }

  /**
   * Check if user has specific role
   */
  hasRole(role: UserRole | UserRole[]): boolean {
    return this.authStore.hasRole(role);
  }

  /**
   * Get authentication token
   */
  getToken(): string | null {
    return this.authStore.getToken();
  }

  /**
   * Get complete auth state
   */
  getAuthState() {
    return this.authStore.getAuthState();
  }
}
