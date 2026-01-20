import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';

import { PaymentComponent } from './payment.component';
import { PaymentService } from '../../ervices/payment.service';
import { Router } from '@angular/router';

describe('PaymentComponent', () => {
  let component: PaymentComponent;
  let fixture: ComponentFixture<PaymentComponent>;
  let mockService: jasmine.SpyObj<PaymentService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    mockService = jasmine.createSpyObj('PaymentService', ['submitPayment', 'setPayment']);
    mockRouter = jasmine.createSpyObj('Router', ['navigateByUrl']);

    await TestBed.configureTestingModule({
      imports: [PaymentComponent],
      providers: [
        { provide: PaymentService, useValue: mockService },
        { provide: Router, useValue: mockRouter }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); 
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not call submitPayment when form is invalid', () => {
    component.PaymentForm.controls['toAccount'].setValue('');
    component.PaymentForm.controls['amount'].setValue('');

    component.submit();

    expect(mockService.submitPayment).not.toHaveBeenCalled();
    expect(component.loading).toBeFalse();
  });

  it('should submit and navigate on success', () => {
    const payload = {
      fromAccount: '123456789012',
      toAccount: '000000000001',
      amount: 100,
      remarks: 'Test'
    } as any;

    mockService.submitPayment.and.returnValue(of(payload));

    component.PaymentForm.controls['toAccount'].setValue(payload.toAccount);
    component.PaymentForm.controls['amount'].setValue(String(payload.amount));
    component.PaymentForm.controls['remarks'].setValue(payload.remarks);

    component.submit();

    expect(mockService.submitPayment).toHaveBeenCalled();
    expect(mockService.setPayment).toHaveBeenCalledWith(payload);
    expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/summary');
  });

  it('should set apiError and loading false on service error', () => {
    mockService.submitPayment.and.returnValue(throwError(() => new Error('fail')));

    component.PaymentForm.controls['toAccount'].setValue('000000000002');
    component.PaymentForm.controls['amount'].setValue('50');

    component.submit();

    expect(component.apiError).toBe('Service unavailable. Please retry.');
    expect(component.loading).toBeFalse();
  });
});
