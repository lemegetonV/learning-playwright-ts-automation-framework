import type { Locator, Page } from '@playwright/test';

import type { CheckoutCustomer } from '../types/checkout';
import { BasePage } from './BasePage';

export class CheckoutPage extends BasePage {
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly postalCodeInput: Locator;
  readonly continueButton: Locator;
  readonly finishButton: Locator;
  readonly errorMessage: Locator;
  readonly completeHeader: Locator;
  readonly backHomeButton: Locator;
  readonly cancelButton: Locator;
  readonly overviewItems: Locator;
  readonly subtotalLabel: Locator;
  readonly taxLabel: Locator;
  readonly totalLabel: Locator;
  readonly paymentInfoLabel: Locator;
  readonly shippingInfoLabel: Locator;

  constructor(page: Page) {
    super(page);
    this.firstNameInput = page.locator('[data-test="firstName"]');
    this.lastNameInput = page.locator('[data-test="lastName"]');
    this.postalCodeInput = page.locator('[data-test="postalCode"]');
    this.continueButton = page.locator('[data-test="continue"]');
    this.finishButton = page.locator('[data-test="finish"]');
    this.errorMessage = page.locator('[data-test="error"]');
    this.completeHeader = page.locator('.complete-header');
    this.backHomeButton = page.locator('[data-test="back-to-products"]');
    this.cancelButton = page.locator('[data-test="cancel"]');
    this.overviewItems = page.locator('.cart_item');
    this.subtotalLabel = page.locator('.summary_subtotal_label');
    this.taxLabel = page.locator('.summary_tax_label');
    this.totalLabel = page.locator('.summary_total_label');
    this.paymentInfoLabel = page.locator('[data-test="payment-info-label"]');
    this.shippingInfoLabel = page.locator('[data-test="shipping-info-label"]');
  }

  async fillCustomerInformation(customer: CheckoutCustomer): Promise<void> {
    await this.firstNameInput.fill(customer.firstName);
    await this.lastNameInput.fill(customer.lastName);
    await this.postalCodeInput.fill(customer.postalCode);
  }

  async continue(): Promise<void> {
    await this.continueButton.click();
  }

  async finish(): Promise<void> {
    await this.finishButton.click();
  }

  async cancel(): Promise<void> {
    await this.cancelButton.click();
  }

  async getOverviewItemNames(): Promise<string[]> {
    return this.overviewItems.locator('.inventory_item_name').allTextContents();
  }

  async getOverviewItemPrices(): Promise<string[]> {
    return this.overviewItems.locator('.inventory_item_price').allTextContents();
  }

  async getSubtotalText(): Promise<string> {
    return (await this.subtotalLabel.textContent()) ?? '';
  }

  async getTaxText(): Promise<string> {
    return (await this.taxLabel.textContent()) ?? '';
  }

  async getTotalText(): Promise<string> {
    return (await this.totalLabel.textContent()) ?? '';
  }

  async getErrorMessage(): Promise<string> {
    return (await this.errorMessage.textContent()) ?? '';
  }

  async getCompleteMessage(): Promise<string> {
    return (await this.completeHeader.textContent()) ?? '';
  }

  async backHome(): Promise<void> {
    await this.backHomeButton.click();
  }
}
