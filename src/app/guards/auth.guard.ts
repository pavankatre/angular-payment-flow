import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../ervices/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    
    // Check if user is logged in
    if (this.authService.isLoggedIn()) {
      return true;
    }

    // Store the attempted URL for redirecting after login
    sessionStorage.setItem('redirectUrl', state.url);

    // Navigate to login page
    this.router.navigate(['/login']);
    return false;
  }
}
