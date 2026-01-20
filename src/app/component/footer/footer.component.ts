import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Footer Component
 * Displays footer information and links
 * Standalone component with responsive design
 */
@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
  
  currentYear = new Date().getFullYear();

  /**
   * Get current year for copyright notice
   */
  getYear(): number {
    return this.currentYear;
  }
}
