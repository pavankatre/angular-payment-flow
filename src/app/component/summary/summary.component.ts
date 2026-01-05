import { Component } from '@angular/core';
import { PaymentService } from '../../ervices/payment.service';

@Component({
  selector: 'app-summary',
  standalone: true,
  imports: [],
  templateUrl: './summary.component.html',
  styleUrl: './summary.component.scss'
})
export class SummaryComponent {
payment = this.service.getPayment();

  constructor(private service: PaymentService) {}
}
