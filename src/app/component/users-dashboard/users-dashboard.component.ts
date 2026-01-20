import { Component, OnInit, OnDestroy, signal, Signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { User } from '../../models/user.model';
import { UserService } from '../../ervices/user.service';
import { UsersDashboardService, SortConfig } from '../../ervices/users-dashboard.service';
import { Subject, takeUntil, debounceTime } from 'rxjs';

@Component({
  selector: 'app-users-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './users-dashboard.component.html',
  styleUrls: ['./users-dashboard.component.scss']
})
export class UsersDashboardComponent implements OnInit, OnDestroy {

  // Signals for reactive state management
  users = signal<User[]>([]);
  filteredUsers = signal<User[]>([]);
  
  // State Management Signals
  loading = signal(false);
  error = signal<string | null>(null);
  
  // Search & Filter Signals
  searchTerm = signal('');
  private searchSubject = new Subject<string>();
  
  // Sort Signal
  sortConfig = signal<SortConfig>({ key: 'name', direction: 'asc' });
  
  // Destroy Subject for cleanup
  private destroy$ = new Subject<void>();

  constructor(
    private userService: UserService,
    private dashboardService: UsersDashboardService
  ) { }

  ngOnInit(): void {
    // Setup debounced search with signal update
    this.searchSubject
      .pipe(
        debounceTime(300),
        takeUntil(this.destroy$)
      )
      .subscribe((searchTerm: string) => {
        this.searchTerm.set(searchTerm);
        this.applyFilterAndSort();
      });

    this.loadUsers();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Load users from UserService (API call)
   */
  private loadUsers(): void {
    this.loading.set(true);
    this.error.set(null);

    this.userService.getUsers()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          if (data && data.length > 0) {
            this.users.set(data);
            this.applyFilterAndSort();
            this.loading.set(false);
          } else {
            this.handleError('Failed to load users');
          }
        },
        error: (err) => {
          console.error('Failed to fetch users:', err);
          this.handleError('Failed to load users');
        }
      });
  }

  /**
   * Handle error scenarios
   */
  private handleError(message: string): void {
    this.error.set(message);
    this.loading.set(false);
    this.users.set([]);
    this.filteredUsers.set([]);
  }

  /**
   * Apply both filter and sort to users using dashboard service
   */
  private applyFilterAndSort(): void {
    this.filteredUsers.set(
      this.dashboardService.applyFilterAndSort(
        this.users(),
        this.searchTerm(),
        this.sortConfig()
      )
    );
  }

  /**
   * Handle search input changes with debouncing
   */
  onSearch(event: any): void {
    this.searchSubject.next(event.target.value);
  }

  /**
   * Handle sort column click
   */
  onSort(key: keyof User | 'companyName'): void {
    this.sortConfig.set(
      this.dashboardService.updateSortConfig(this.sortConfig(), key)
    );
    this.applyFilterAndSort();
  }

  /**
   * Get sort indicator for column header
   */
  getSortIndicator(key: keyof User | 'companyName'): string {
    const isCurrentlySorted = this.dashboardService.isSortedColumn(key, this.sortConfig().key);
    return this.dashboardService.getSortIndicator(isCurrentlySorted, this.sortConfig().direction);
  }

  /**
   * Check if column is currently sorted
   */
  isSortedColumn(key: keyof User | 'companyName'): boolean {
    return this.dashboardService.isSortedColumn(key, this.sortConfig().key);
  }

  /**
   * Retry loading users
   */
  retryLoad(): void {
    this.loadUsers();
  }
}
