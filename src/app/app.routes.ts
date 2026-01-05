import { Routes } from '@angular/router';
import { PaymentComponent } from './component/payment/payment.component';
import { SummaryComponent } from './component/summary/summary.component';

export const routes: Routes = [

    { path: '', redirectTo: 'payment', pathMatch: 'full' },
  { path: 'payment', component: PaymentComponent },
  { path: 'summary', component: SummaryComponent }
];
