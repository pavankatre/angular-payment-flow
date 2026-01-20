import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UsersDashboardComponent } from './users-dashboard.component';
import { UserService } from '../../ervices/user.service';
import { of, throwError } from 'rxjs';
import { User } from '../../models/user.model';

describe('UsersDashboardComponent', () => {
  let component: UsersDashboardComponent;
  let fixture: ComponentFixture<UsersDashboardComponent>;
  let userService: jasmine.SpyObj<UserService>;

  const mockUsers: User[] = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      phone: '123-456-7890',
      company: { name: 'Tech Corp' }
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane@example.com',
      phone: '987-654-3210',
      company: { name: 'Design Inc' }
    }
  ];

  beforeEach(async () => {
    const userServiceSpy = jasmine.createSpyObj('UserService', ['getUsers']);

    await TestBed.configureTestingModule({
      imports: [UsersDashboardComponent],
      providers: [
        { provide: UserService, useValue: userServiceSpy }
      ]
    }).compileComponents();

    userService = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
    fixture = TestBed.createComponent(UsersDashboardComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load users on init', () => {
    userService.getUsers.and.returnValue(of(mockUsers));

    fixture.detectChanges();

    expect(userService.getUsers).toHaveBeenCalled();
    expect(component.users.length).toBe(2);
  });

  it('should display error on API failure', () => {
    userService.getUsers.and.returnValue(throwError(() => new Error('API Error')));

    fixture.detectChanges();

    expect(component.error).toBe('Failed to load users');
    expect(component.users.length).toBe(0);
  });

  it('should filter users by name', () => {
    userService.getUsers.and.returnValue(of(mockUsers));

    fixture.detectChanges();
    component.searchTerm = 'John';
    component['applyFilterAndSort']();

    expect(component.filteredUsers.length).toBe(1);
    expect(component.filteredUsers[0].name).toBe('John Doe');
  });

  it('should filter users by email', () => {
    userService.getUsers.and.returnValue(of(mockUsers));

    fixture.detectChanges();
    component.searchTerm = 'jane@';
    component['applyFilterAndSort']();

    expect(component.filteredUsers.length).toBe(1);
    expect(component.filteredUsers[0].email).toBe('jane@example.com');
  });

  it('should sort users by name', () => {
    userService.getUsers.and.returnValue(of(mockUsers));

    fixture.detectChanges();
    component.onSort('name');

    expect(component.filteredUsers[0].name).toBe('Jane Smith');
    expect(component.filteredUsers[1].name).toBe('John Doe');
  });

  it('should sort users by company name', () => {
    userService.getUsers.and.returnValue(of(mockUsers));

    fixture.detectChanges();
    component.onSort('companyName');

    expect(component.filteredUsers[0].company.name).toBe('Design Inc');
    expect(component.filteredUsers[1].company.name).toBe('Tech Corp');
  });

  it('should toggle sort direction on same column click', () => {
    userService.getUsers.and.returnValue(of(mockUsers));

    fixture.detectChanges();
    component.onSort('name');
    const firstSort = component.filteredUsers[0].name;

    component.onSort('name');
    const secondSort = component.filteredUsers[0].name;

    expect(firstSort).not.toBe(secondSort);
  });
});
