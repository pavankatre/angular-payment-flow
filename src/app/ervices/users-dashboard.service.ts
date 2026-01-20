import { Injectable } from '@angular/core';
import { User } from '../models/user.model';

export interface SortConfig {
  key: keyof User | 'companyName';
  direction: 'asc' | 'desc';
}

/**
 * Users Dashboard Service
 * Handles all business logic for user filtering, sorting, and data manipulation
 * This service centralizes the dashboard logic to keep the component clean
 */
@Injectable({
  providedIn: 'root'
})
export class UsersDashboardService {

  constructor() { }

  /**
   * Filter users based on search term (case-insensitive)
   * Searches in name and email fields
   * @param users - Array of users to filter
   * @param searchTerm - Search string
   * @returns Filtered array of users
   */
  filterUsers(users: User[], searchTerm: string): User[] {
    if (!searchTerm || !searchTerm.trim()) {
      return users;
    }

    const searchLower = searchTerm.toLowerCase();
    return users.filter(user =>
      user.name.toLowerCase().includes(searchLower) ||
      user.email.toLowerCase().includes(searchLower)
    );
  }

  /**
   * Sort users based on the provided sort configuration
   * @param users - Array of users to sort
   * @param sortConfig - Configuration containing key and direction
   * @returns Sorted array of users
   */
  sortUsers(users: User[], sortConfig: SortConfig): User[] {
    const sorted = [...users];

    sorted.sort((a, b) => {
      let valueA: any;
      let valueB: any;

      // Handle company name specifically
      if (sortConfig.key === 'companyName') {
        valueA = a.company?.name || '';
        valueB = b.company?.name || '';
      } else {
        valueA = a[sortConfig.key as keyof User];
        valueB = b[sortConfig.key as keyof User];
      }

      // Convert to string for comparison
      valueA = String(valueA).toLowerCase();
      valueB = String(valueB).toLowerCase();

      if (valueA < valueB) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (valueA > valueB) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });

    return sorted;
  }

  /**
   * Apply both filter and sort operations in sequence
   * @param users - Array of users to process
   * @param searchTerm - Search string for filtering
   * @param sortConfig - Sort configuration
   * @returns Processed array of users
   */
  applyFilterAndSort(users: User[], searchTerm: string, sortConfig: SortConfig): User[] {
    let result = this.filterUsers(users, searchTerm);
    result = this.sortUsers(result, sortConfig);
    return result;
  }

  /**
   * Toggle sort direction and update sort key
   * If clicking the same column, toggle direction. Otherwise, set new column with ascending direction.
   * @param currentSort - Current sort configuration
   * @param newKey - New sort key to apply
   * @returns Updated sort configuration
   */
  updateSortConfig(currentSort: SortConfig, newKey: keyof User | 'companyName'): SortConfig {
    if (currentSort.key === newKey) {
      // Toggle direction if same column
      return {
        ...currentSort,
        direction: currentSort.direction === 'asc' ? 'desc' : 'asc'
      };
    } else {
      // Set new column and reset to asc
      return {
        key: newKey,
        direction: 'asc'
      };
    }
  }

  /**
   * Get sort indicator symbol for UI display
   * @param isCurrentlySorted - Whether this column is currently sorted
   * @param direction - Current sort direction
   * @returns Sort indicator string (▲ or ▼)
   */
  getSortIndicator(isCurrentlySorted: boolean, direction: 'asc' | 'desc'): string {
    if (!isCurrentlySorted) return '';
    return direction === 'asc' ? '▲' : '▼';
  }

  /**
   * Check if a specific column is currently sorted
   * @param sortKey - Sort key to check
   * @param currentKey - Current sort key
   * @returns Boolean indicating if column is sorted
   */
  isSortedColumn(sortKey: keyof User | 'companyName', currentKey: keyof User | 'companyName'): boolean {
    return sortKey === currentKey;
  }
}
