import type { Locator, Page } from '@playwright/test';

import type { SauceDemoProductName } from '../types/products';
import { ProductSortOption } from '../types/products';
import { BasePage } from './BasePage';

export class ProductsPage extends BasePage {
  readonly title: Locator;
  readonly inventoryItems: Locator;
  readonly shoppingCartBadge: Locator;
  readonly shoppingCartLink: Locator;
  readonly sortDropdown: Locator;

  constructor(page: Page) {
    super(page);
    this.title = page.locator('.title');
    this.inventoryItems = page.locator('.inventory_item');
    this.shoppingCartBadge = page.locator('.shopping_cart_badge');
    this.shoppingCartLink = page.locator('.shopping_cart_link');
    this.sortDropdown = page.locator('[data-test="product-sort-container"]');
  }

  async goto(): Promise<void> {
    await super.goto('/inventory.html');
  }

  async getProductCount(): Promise<number> {
    return this.inventoryItems.count();
  }

  async getProductNames(): Promise<string[]> {
    return this.inventoryItems.locator('.inventory_item_name').allTextContents();
  }

  async addProductToCart(productName: SauceDemoProductName): Promise<void> {
    await this.productCard(productName).getByRole('button', { name: 'Add to cart' }).click();
  }

  async removeProductFromCart(productName: SauceDemoProductName): Promise<void> {
    await this.productCard(productName).getByRole('button', { name: 'Remove' }).click();
  }

  async getCartItemCount(): Promise<number> {
    if (!(await this.shoppingCartBadge.isVisible())) {
      return 0;
    }

    return Number((await this.shoppingCartBadge.textContent()) ?? '0');
  }

  async goToCart(): Promise<void> {
    await this.shoppingCartLink.click();
  }

  async sortBy(option: ProductSortOption): Promise<void> {
    await this.sortDropdown.selectOption(option);
  }

  async getProductPrice(productName: SauceDemoProductName): Promise<string> {
    return (await this.productCard(productName).locator('.inventory_item_price').textContent()) ?? '';
  }

  async isProductInCart(productName: SauceDemoProductName): Promise<boolean> {
    return this.productCard(productName).getByRole('button', { name: 'Remove' }).isVisible();
  }

  private productCard(productName: SauceDemoProductName): Locator {
    return this.inventoryItems.filter({ hasText: productName });
  }
}
