import { Validators } from '@angular/forms';

export const ACCOUNT_VALIDATOR = Validators.pattern(/^\d{12,16}$/);
export const AMOUNT_VALIDATOR = Validators.pattern(/^\d{1,8}(\.\d{1,2})?$/);
