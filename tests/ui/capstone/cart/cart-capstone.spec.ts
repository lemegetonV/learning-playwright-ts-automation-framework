import { expect, test, type Page } from '@playwright/test';

import { CartPage } from '../../../../src/page-objects/CartPage';
import { LoginPage } from '../../../../src/page-objects/LoginPage';
import { ProductsPage } from '../../../../src/page-objects/ProductsPage';
import {
  CapstoneProductNames,
  CapstoneProductPriceByName,
} from '../../../../src/utils/capstone-data';
import { SauceDemoUsers } from '../../../../src/utils/test-users';

test.describe('Capstone shopping cart coverage', () => {
  let cartPage: CartPage;
  let productsPage: ProductsPage;

  async function loginAsStandardUser(page: Page): Promise<void> {
    const loginPage = new LoginPage(page);
    productsPage = new ProductsPage(page);
    cartPage = new CartPage(page);

    await loginPage.goto();
    await loginPage.login(SauceDemoUsers.standard);
  }

  test.beforeEach(async ({ page }) => {
    await loginAsStandardUser(page);
  });

  test.describe('Add items to cart', () => {
    test('single item added from products page appears in cart', async () => {
      await productsPage.addProductToCart('Sauce Labs Backpack');
      await productsPage.goToCart();

      expect(await cartPage.getItemNames()).toEqual(['Sauce Labs Backpack']);
    });

    test('two items added from products page appear in cart', async () => {
      await productsPage.addProductToCart('Sauce Labs Backpack');
      await productsPage.addProductToCart('Sauce Labs Bike Light');
      await productsPage.goToCart();

      expect(await cartPage.getItemNames()).toEqual(['Sauce Labs Backpack', 'Sauce Labs Bike Light']);
    });

    test('all catalog items can be added to cart', async () => {
      for (const productName of CapstoneProductNames) {
        await productsPage.addProductToCart(productName);
      }
      await productsPage.goToCart();

      expect(await cartPage.getItemCount()).toBe(6);
    });
  });

  test.describe('Remove items from cart', () => {
    test('single item can be removed from cart page', async () => {
      await productsPage.addProductToCart('Sauce Labs Backpack');
      await productsPage.goToCart();
      await cartPage.removeItemByName('Sauce Labs Backpack');

      await expect(cartPage.cartItems).toHaveCount(0);
    });

    test('one item can be removed while another remains', async () => {
      await productsPage.addProductToCart('Sauce Labs Backpack');
      await productsPage.addProductToCart('Sauce Labs Bike Light');
      await productsPage.goToCart();
      await cartPage.removeItemByName('Sauce Labs Backpack');

      expect(await cartPage.getItemNames()).toEqual(['Sauce Labs Bike Light']);
    });

    test('all cart items can be removed one by one', async () => {
      await productsPage.addProductToCart('Sauce Labs Backpack');
      await productsPage.addProductToCart('Sauce Labs Bike Light');
      await productsPage.goToCart();
      await cartPage.removeItemByName('Sauce Labs Backpack');
      await cartPage.removeItemByName('Sauce Labs Bike Light');

      expect(await cartPage.getItemCount()).toBe(0);
    });

    test('product removed on inventory page does not appear in cart', async () => {
      await productsPage.addProductToCart('Sauce Labs Backpack');
      await productsPage.removeProductFromCart('Sauce Labs Backpack');
      await productsPage.goToCart();

      expect(await cartPage.hasItem('Sauce Labs Backpack')).toBe(false);
    });
  });

  test.describe('Cart navigation', () => {
    test('cart link opens the cart page', async ({ page }) => {
      await productsPage.goToCart();

      await expect(page).toHaveURL(/cart.html/);
      await expect(cartPage.title).toHaveText('Your Cart');
    });

    test('continue shopping returns to inventory page', async ({ page }) => {
      await productsPage.goToCart();
      await cartPage.continueShopping();

      await expect(page).toHaveURL(/inventory.html/);
      await expect(productsPage.title).toHaveText('Products');
    });

    test('checkout button opens checkout information page', async ({ page }) => {
      await productsPage.addProductToCart('Sauce Labs Backpack');
      await productsPage.goToCart();
      await cartPage.checkout();

      await expect(page).toHaveURL(/checkout-step-one.html/);
    });
  });

  test.describe('Cart calculations', () => {
    test('cart item prices match product catalog data', async () => {
      await productsPage.addProductToCart('Sauce Labs Backpack');
      await productsPage.addProductToCart('Sauce Labs Bike Light');
      await productsPage.goToCart();

      expect(await cartPage.getItemPrice('Sauce Labs Backpack')).toBe(
        CapstoneProductPriceByName['Sauce Labs Backpack'],
      );
      expect(await cartPage.getItemPrice('Sauce Labs Bike Light')).toBe(
        CapstoneProductPriceByName['Sauce Labs Bike Light'],
      );
    });

    test('cart quantities are one for each added item', async () => {
      await productsPage.addProductToCart('Sauce Labs Backpack');
      await productsPage.addProductToCart('Sauce Labs Bike Light');
      await productsPage.goToCart();

      expect(await cartPage.getItemQuantities()).toEqual([1, 1]);
    });

    test('cart item count matches cart badge before navigation', async () => {
      await productsPage.addProductToCart('Sauce Labs Backpack');
      await productsPage.addProductToCart('Sauce Labs Bike Light');
      expect(await productsPage.getCartItemCount()).toBe(2);

      await productsPage.goToCart();
      expect(await cartPage.getItemCount()).toBe(2);
    });
  });

  test.describe('Cart item details', () => {
    test('cart item exposes expected name and quantity', async () => {
      await productsPage.addProductToCart('Sauce Labs Backpack');
      await productsPage.goToCart();

      expect(await cartPage.getItemDetails('Sauce Labs Backpack')).toEqual({
        name: 'Sauce Labs Backpack',
        quantity: 1,
      });
    });

    test('cart item exposes expected description and price', async () => {
      await productsPage.addProductToCart('Sauce Labs Backpack');
      await productsPage.goToCart();

      expect(await cartPage.getProductDescription('Sauce Labs Backpack')).toContain('carry.allTheThings');
      expect(await cartPage.getItemPrice('Sauce Labs Backpack')).toBe('$29.99');
    });
  });

  test.describe('Empty cart scenarios', () => {
    test('direct cart navigation starts with an empty cart', async () => {
      await cartPage.goto();

      expect(await cartPage.getItemCount()).toBe(0);
    });

    test('cart is empty after removing the only item', async () => {
      await productsPage.addProductToCart('Sauce Labs Backpack');
      await productsPage.goToCart();
      await cartPage.removeItemByName('Sauce Labs Backpack');

      expect(await cartPage.getItemNames()).toEqual([]);
    });

    test('empty cart still shows checkout controls consistently', async () => {
      await cartPage.goto();

      await expect(cartPage.checkoutButton).toBeVisible();
      await expect(cartPage.continueShoppingButton).toBeVisible();
    });
  });

  test.describe('Cart persistence', () => {
    test('cart items persist after navigating away and back', async () => {
      await productsPage.addProductToCart('Sauce Labs Backpack');
      await productsPage.goToCart();
      await cartPage.continueShopping();
      await productsPage.goToCart();

      expect(await cartPage.getItemNames()).toEqual(['Sauce Labs Backpack']);
    });
  });

  test.describe('Verification methods', () => {
    test('item count helper reports the number of cart rows', async () => {
      await productsPage.addProductToCart('Sauce Labs Backpack');
      await productsPage.addProductToCart('Sauce Labs Bike Light');
      await productsPage.goToCart();

      expect(await cartPage.getItemCount()).toBe(2);
    });

    test('hasItem returns false for a product not in the cart', async () => {
      await productsPage.addProductToCart('Sauce Labs Backpack');
      await productsPage.goToCart();

      expect(await cartPage.hasItem('Sauce Labs Bike Light')).toBe(false);
    });
  });

  test.describe('Cart display details', () => {
    test('cart list is visible on the cart page', async () => {
      await cartPage.goto();

      await expect(cartPage.cartList).toBeVisible();
    });

    test('cart page title and action buttons are visible', async () => {
      await cartPage.goto();

      await expect(cartPage.title).toHaveText('Your Cart');
      await expect(cartPage.checkoutButton).toBeVisible();
      await expect(cartPage.continueShoppingButton).toBeVisible();
    });
  });
});
