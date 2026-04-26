import type { CheckoutCustomer } from './checkout';
import type { SauceDemoProductName } from './products';
import type { TestUser } from './test-users';

export interface CapstoneProduct {
  readonly name: SauceDemoProductName;
  readonly price: string;
  readonly description: string;
}

export interface InvalidLoginCase {
  readonly title: string;
  readonly username: string;
  readonly password: string;
  readonly expectedError: string;
}

export interface ValidLoginCase {
  readonly title: string;
  readonly user: TestUser;
}

export interface CheckoutValidationCase {
  readonly title: string;
  readonly customer: CheckoutCustomer;
  readonly expectedError: string;
}

export interface ApiResult<TBody> {
  readonly status: number;
  readonly body: TBody;
}
