import { Routes } from '@angular/router';
import { PaymentComponent } from './component/payment/payment.component';
import { SummaryComponent } from './component/summary/summary.component';
import { UsersDashboardComponent } from './component/users-dashboard/users-dashboard.component';
import { LoginComponent } from './component/login/login.component';
import { AuthGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/role.guard';
import { UserRole } from './models/login.model';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  
  // Protected routes with AuthGuard
  { path: 'dashboard', component: UsersDashboardComponent, canActivate: [AuthGuard] },
  { path: 'payment', component: PaymentComponent, canActivate: [AuthGuard] },
  { path: 'summary', component: SummaryComponent, canActivate: [AuthGuard, RoleGuard], data: { roles: [UserRole.ADMIN, UserRole.USER] } },
  { path: 'users', component: UsersDashboardComponent, canActivate: [AuthGuard, RoleGuard], data: { roles: [UserRole.ADMIN] } }
];
