import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../ervices/auth.service';
import { AuthUser } from '../../models/login.model';

/**
 * Header Component
 * Displays navigation bar with links to different sections
 * Standalone component with responsive design
 */
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  
  isMenuOpen = false;
  isProfileMenuOpen = signal(false);
  currentUser = signal<AuthUser | null>(null);
  isLoggedIn = signal(false);

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    // Subscribe to current user changes
    this.currentUser.set(this.authService.getCurrentUser());
    this.isLoggedIn.set(this.authService.isLoggedIn());

    // Subscribe to auth observable for real-time updates
    this.authService.auth$.subscribe((user: AuthUser | null) => {
      this.currentUser.set(user);
      this.isLoggedIn.set(user !== null);
    });
  }

  /**
   * Toggle mobile menu visibility
   */
  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  /**
   * Close menu when link is clicked
   */
  closeMenu(): void {
    this.isMenuOpen = false;
  }

  /**
   * Toggle profile dropdown menu
   */
  toggleProfileMenu(): void {
    this.isProfileMenuOpen.set(!this.isProfileMenuOpen());
  }

  /**
   * Close profile menu
   */
  closeProfileMenu(): void {
    this.isProfileMenuOpen.set(false);
  }

  /**
   * Handle logout
   */
  logout(): void {
    this.authService.logout();
    this.closeProfileMenu();
    this.router.navigate(['/login']);
  }

  /**
   * Get first letter of username for avatar
   */
  getAvatarInitial(): string {
    const user = this.currentUser();
    if (user && user.username) {
      return user.username.charAt(0).toUpperCase();
    }
    return 'U';
  }

  /**
   * Get user role display text
   */
  getRoleDisplay(): string {
    const user = this.currentUser();
    if (user && user.role) {
      return user.role.charAt(0).toUpperCase() + user.role.slice(1);
    }
    return 'User';
  }
}

