import { Component } from '@angular/core';
import { PaymentService } from '../../ervices/payment.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-summary',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss']
})
export class SummaryComponent {
  payment = this.service.getPayment();

  constructor(private service: PaymentService) {}
}
