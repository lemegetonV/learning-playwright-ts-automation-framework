import type { Locator, Page } from '@playwright/test';

import type { SauceDemoProductName } from '../types/products';
import { BasePage } from './BasePage';

export class CartPage extends BasePage {
  readonly title: Locator;
  readonly cartItems: Locator;
  readonly checkoutButton: Locator;
  readonly continueShoppingButton: Locator;
  readonly cartList: Locator;

  constructor(page: Page) {
    super(page);
    this.title = page.locator('.title');
    this.cartItems = page.locator('.cart_item');
    this.checkoutButton = page.locator('[data-test="checkout"]');
    this.continueShoppingButton = page.locator('[data-test="continue-shopping"]');
    this.cartList = page.locator('.cart_list');
  }

  async goto(): Promise<void> {
    await super.goto('/cart.html');
  }

  async getItemCount(): Promise<number> {
    return this.cartItems.count();
  }

  async getItemNames(): Promise<string[]> {
    return this.cartItems.locator('.inventory_item_name').allTextContents();
  }

  async getItemQuantities(): Promise<number[]> {
    const quantities = await this.cartItems.locator('.cart_quantity').allTextContents();

    return quantities.map(Number);
  }

  async removeItemByName(productName: SauceDemoProductName): Promise<void> {
    await this.cartItem(productName).getByRole('button', { name: 'Remove' }).click();
  }

  async getItemPrice(productName: SauceDemoProductName): Promise<string> {
    return (await this.cartItem(productName).locator('.inventory_item_price').textContent()) ?? '';
  }

  async getItemDetails(productName: SauceDemoProductName): Promise<{
    name: string;
    quantity: number;
  }> {
    const item = this.cartItem(productName);
    const name = (await item.locator('.inventory_item_name').textContent()) ?? '';
    const quantityText = (await item.locator('.cart_quantity').textContent()) ?? '0';

    return {
      name,
      quantity: Number(quantityText),
    };
  }

  async getProductDescription(productName: SauceDemoProductName): Promise<string> {
    return (await this.cartItem(productName).locator('.inventory_item_desc').textContent()) ?? '';
  }

  async hasItem(productName: SauceDemoProductName): Promise<boolean> {
    return this.cartItem(productName).isVisible();
  }

  async continueShopping(): Promise<void> {
    await this.continueShoppingButton.click();
  }

  async checkout(): Promise<void> {
    await this.checkoutButton.click();
  }

  private cartItem(productName: SauceDemoProductName): Locator {
    return this.cartItems.filter({ hasText: productName });
  }
}
