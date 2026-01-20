import { TestBed, fakeAsync, tick } from '@angular/core/testing';

import { PaymentService } from './payment.service';
import { Payment } from '../models/payment.model';

describe('PaymentService', () => {
  let service: PaymentService;
  let originalRandom: () => number;

  beforeEach(() => {
    originalRandom = Math.random;
    TestBed.configureTestingModule({});
    service = TestBed.inject(PaymentService);
  });

  afterEach(() => {
    Math.random = originalRandom;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('returns fallback when no payment set', () => {
    const p = service.getPayment();
    expect(p).toBeTruthy();
    expect(p.fromAccount).toBeDefined();
    expect(p.toAccount).toBeDefined();
  });

  it('setPayment and getPayment return the same object', () => {
    const payment: Payment = {
      fromAccount: '111111111111',
      toAccount: '222222222222',
      amount: 123,
      remarks: 'Test'
    };

    service.setPayment(payment);
    const got = service.getPayment();
    expect(got).toEqual(payment);
  });

  it('submitPayment emits payment on success', fakeAsync(() => {
    const payment: Payment = {
      fromAccount: '111111111111',
      toAccount: '222222222222',
      amount: 50,
      remarks: 'OK'
    };

    Math.random = () => 0.9; // force success (0.9 > 0.3)

    let result: Payment | undefined;
    service.submitPayment(payment).subscribe({
      next: (r) => (result = r),
      error: () => fail('should not error')
    });

    tick(1000);
    expect(result).toEqual(payment);
  }));

  it('submitPayment errors on failure', fakeAsync(() => {
    const payment: Payment = {
      fromAccount: '111111111111',
      toAccount: '222222222222',
      amount: 50,
      remarks: 'Fail'
    };

    Math.random = () => 0.1; // force failure (0.1 <= 0.3)

    let err: any;
    service.submitPayment(payment).subscribe({
      next: () => fail('should not succeed'),
      error: (e) => (err = e)
    });

    tick(1000);
    expect(err).toBeTruthy();
    expect(err.message).toBe('API Failed');
  }));
});
