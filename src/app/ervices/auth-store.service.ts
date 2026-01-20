import { Injectable, signal } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AuthUser, UserRole, LoginCredentials } from '../models/login.model';

@Injectable({
  providedIn: 'root'
})
export class AuthStoreService {

  // Signals for reactive state management
  private currentUser = signal<AuthUser | null>(null);
  private isAuthenticated = signal(false);
  private userRole = signal<UserRole | null>(null);
  private authToken = signal<string | null>(null);
  private loading = signal(false);
  private error = signal<string | null>(null);

  // Observable subjects for legacy support
  private authSubject = new BehaviorSubject<AuthUser | null>(null);
  public auth$ = this.authSubject.asObservable();

  // Session storage keys
  private readonly SESSION_KEY = 'auth_user';
  private readonly TOKEN_KEY = 'auth_token';
  private readonly ROLE_KEY = 'user_role';

  constructor() {
    this.initializeStore();
  }

  /**
   * Initialize store from session storage
   */
  private initializeStore(): void {
    this.restoreSession();
  }

  /**
   * Restore session from session storage if exists
   */
  private restoreSession(): void {
    try {
      const storedUser = sessionStorage.getItem(this.SESSION_KEY);
      const storedToken = sessionStorage.getItem(this.TOKEN_KEY);
      const storedRole = sessionStorage.getItem(this.ROLE_KEY);

      if (storedUser && storedToken) {
        const user: AuthUser = JSON.parse(storedUser);
        this.setCurrentUser(user);
        this.setToken(storedToken);
        this.setUserRole((storedRole as UserRole) || user.role);
        this.setIsAuthenticated(true);
        this.authSubject.next(user);
      }
    } catch (error) {
      console.error('Failed to restore session:', error);
      this.clearAllState();
    }
  }

  /**
   * Set current user
   */
  setCurrentUser(user: AuthUser | null): void {
    this.currentUser.set(user);
    if (user) {
      sessionStorage.setItem(this.SESSION_KEY, JSON.stringify(user));
    } else {
      sessionStorage.removeItem(this.SESSION_KEY);
    }
  }

  /**
   * Get current user
   */
  getCurrentUser(): AuthUser | null {
    return this.currentUser();
  }

  /**
   * Get current user signal
   */
  getCurrentUserSignal() {
    return this.currentUser;
  }

  /**
   * Set authentication state
   */
  setIsAuthenticated(isAuth: boolean): void {
    this.isAuthenticated.set(isAuth);
  }

  /**
   * Get authentication state
   */
  isLoggedIn(): boolean {
    return this.isAuthenticated();
  }

  /**
   * Get authentication signal
   */
  getAuthSignal() {
    return this.isAuthenticated;
  }

  /**
   * Set user role
   */
  setUserRole(role: UserRole | null): void {
    this.userRole.set(role);
    if (role) {
      sessionStorage.setItem(this.ROLE_KEY, role);
    } else {
      sessionStorage.removeItem(this.ROLE_KEY);
    }
  }

  /**
   * Get user role
   */
  getUserRole(): UserRole | null {
    return this.userRole();
  }

  /**
   * Get user role signal
   */
  getUserRoleSignal() {
    return this.userRole;
  }

  /**
   * Check if user has specific role
   */
  hasRole(role: UserRole | UserRole[]): boolean {
    const currentRole = this.userRole();
    if (!currentRole) return false;

    if (Array.isArray(role)) {
      return role.includes(currentRole);
    }

    return currentRole === role;
  }

  /**
   * Set auth token
   */
  setToken(token: string | null): void {
    this.authToken.set(token);
    if (token) {
      sessionStorage.setItem(this.TOKEN_KEY, token);
    } else {
      sessionStorage.removeItem(this.TOKEN_KEY);
    }
  }

  /**
   * Get auth token
   */
  getToken(): string | null {
    return this.authToken();
  }

  /**
   * Get token signal
   */
  getTokenSignal() {
    return this.authToken;
  }

  /**
   * Set loading state
   */
  setLoading(isLoading: boolean): void {
    this.loading.set(isLoading);
  }

  /**
   * Get loading state
   */
  isLoading(): boolean {
    return this.loading();
  }

  /**
   * Get loading signal
   */
  getLoadingSignal() {
    return this.loading;
  }

  /**
   * Set error message
   */
  setError(message: string | null): void {
    this.error.set(message);
  }

  /**
   * Get error message
   */
  getError(): string | null {
    return this.error();
  }

  /**
   * Get error signal
   */
  getErrorSignal() {
    return this.error;
  }

  /**
   * Update login state - Called after successful login
   */
  updateLoginState(user: AuthUser, token: string): void {
    this.setCurrentUser(user);
    this.setToken(token);
    this.setUserRole(user.role);
    this.setIsAuthenticated(true);
    this.setError(null);
    this.authSubject.next(user);
  }

  /**
   * Clear all state - Called on logout
   */
  clearAllState(): void {
    this.setCurrentUser(null);
    this.setToken(null);
    this.setUserRole(null);
    this.setIsAuthenticated(false);
    this.setError(null);
    this.authSubject.next(null);
  }

  /**
   * Get complete auth state
   */
  getAuthState() {
    return {
      user: this.currentUser(),
      isAuthenticated: this.isAuthenticated(),
      role: this.userRole(),
      token: this.authToken(),
      loading: this.loading(),
      error: this.error()
    };
  }

  /**
   * Mock user validation - Can be replaced with actual backend validation
   */
  validateCredentials(credentials: LoginCredentials): boolean {
    const mockUsers: { [key: string]: any } = {
      'admin': { password: 'admin123' },
      'user': { password: 'user123' },
      'viewer': { password: 'viewer123' }
    };

    const user = mockUsers[credentials.username];
    return user && user.password === credentials.password;
  }

  /**
   * Get mock user by username
   */
  getMockUserByUsername(username: string): AuthUser | null {
    const mockUsers: { [key: string]: AuthUser } = {
      'admin': {
        id: '1',
        username: 'admin',
        email: 'admin@example.com',
        role: UserRole.ADMIN
      },
      'user': {
        id: '2',
        username: 'user',
        email: 'user@example.com',
        role: UserRole.USER
      },
      'viewer': {
        id: '3',
        username: 'viewer',
        email: 'viewer@example.com',
        role: UserRole.VIEWER
      }
    };

    return mockUsers[username] || null;
  }
}
