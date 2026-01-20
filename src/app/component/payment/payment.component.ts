import { Component } from '@angular/core';
import { ACCOUNT_VALIDATOR, AMOUNT_VALIDATOR } from '../../utils/validators';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { PaymentService } from '../../ervices/payment.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent {

  loading = false;
  apiError = '';

  PaymentForm = this.fb.group({
    fromAccount: [{ value: '123456789012', disabled: true }, ACCOUNT_VALIDATOR],
    toAccount: ['', [Validators.required, ACCOUNT_VALIDATOR]],
    amount: ['', [Validators.required, AMOUNT_VALIDATOR]],
    remarks: [''] 
  });

  constructor(
    private fb: FormBuilder,
    private service: PaymentService,
    private router: Router
  ) {}

  submit() {
    if (this.PaymentForm.invalid) return;

    this.loading = true;
    this.apiError = '';

    const raw = this.PaymentForm.getRawValue();
    const payload = {
      fromAccount: String(raw.fromAccount ?? ''),
      toAccount: String(raw.toAccount ?? ''),
      amount: Number(raw.amount ?? ''),
      remarks: this.PaymentForm.value.remarks || 'No Remarks'
    };

    this.service.submitPayment(payload).subscribe({
      next: (data) => {
        this.service.setPayment(data);
        this.router.navigateByUrl('/summary');
      },
      error: () => {
        this.apiError = 'Service unavailable. Please retry.';
        this.loading = false;
      }
    });
  }
}