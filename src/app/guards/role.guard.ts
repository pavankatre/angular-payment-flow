import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../ervices/auth.service';
import { UserRole } from '../models/login.model';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    
    // Check if user is authenticated first
    if (!this.authService.isLoggedIn()) {
      sessionStorage.setItem('redirectUrl', state.url);
      this.router.navigate(['/login']);
      return false;
    }

    // Get required roles from route data
    const requiredRoles: UserRole[] = route.data['roles'] as UserRole[];

    // If no roles specified, allow access
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    // Check if user has one of the required roles
    if (this.authService.hasRole(requiredRoles)) {
      return true;
    }

    // User doesn't have required role
    console.warn(`Access denied: User does not have required role(s): ${requiredRoles.join(', ')}`);
    this.router.navigate(['/unauthorized']);
    return false;
  }
}
