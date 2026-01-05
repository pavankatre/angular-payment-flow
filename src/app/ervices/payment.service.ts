import { Injectable, signal } from '@angular/core';
import { delay, Observable, of, throwError } from 'rxjs';
import { Payment } from '../models/payment.model';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  // constructor() { }









// import { Injectable, signal } from '@angular/core';
// import { Payment } from '../models/payment.model';
// import { Observable, of, throwError } from 'rxjs';
// import { delay } from 'rxjs/operators';

// @Injectable({ providedIn: 'root' })
// export class PaymentService {

  private paymentSignal = signal<Payment | null>(null);

  submitPayment(data: Payment): Observable<Payment> {
    const success = Math.random() > 0.3;

    return success
      ? of(data).pipe(delay(1000))
      : throwError(() => new Error('API Failed')).pipe(delay(1000));
  }

  setPayment(data: Payment) {
    this.paymentSignal.set(data);
  }

  getPayment(): Payment {
    return this.paymentSignal() ?? this.getFallback();
  }

  private getFallback(): Payment {
    return {
      fromAccount: '123456789012',
      toAccount: '000000000000',
      amount: 0,
      remarks: 'No Remarks'
    };
  }
}

