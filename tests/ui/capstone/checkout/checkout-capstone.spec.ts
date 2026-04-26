import { expect, test, type Page } from '@playwright/test';

import { CartPage } from '../../../../src/page-objects/CartPage';
import { CheckoutPage } from '../../../../src/page-objects/CheckoutPage';
import { LoginPage } from '../../../../src/page-objects/LoginPage';
import { ProductsPage } from '../../../../src/page-objects/ProductsPage';
import type { CheckoutCustomer } from '../../../../src/types/checkout';
import {
  CheckoutValidationCases,
  ValidCheckoutCustomers,
} from '../../../../src/utils/capstone-data';
import { SauceDemoUsers } from '../../../../src/utils/test-users';

test.describe('Capstone checkout coverage', () => {
  let productsPage: ProductsPage;
  let cartPage: CartPage;
  let checkoutPage: CheckoutPage;

  async function loginAndAddBackpack(page: Page): Promise<void> {
    const loginPage = new LoginPage(page);
    productsPage = new ProductsPage(page);
    cartPage = new CartPage(page);
    checkoutPage = new CheckoutPage(page);

    await loginPage.goto();
    await loginPage.login(SauceDemoUsers.standard);
    await productsPage.addProductToCart('Sauce Labs Backpack');
    await productsPage.goToCart();
  }

  async function openCheckoutInformation(page: Page): Promise<void> {
    await loginAndAddBackpack(page);
    await cartPage.checkout();
  }

  async function openCheckoutOverview(page: Page, customer: CheckoutCustomer = ValidCheckoutCustomers[0]): Promise<void> {
    await openCheckoutInformation(page);
    await checkoutPage.fillCustomerInformation(customer);
    await checkoutPage.continue();
  }

  test.describe('Valid checkout information', () => {
    for (const [index, customer] of ValidCheckoutCustomers.entries()) {
      test(`valid customer information ${index + 1} advances to overview`, async ({ page }) => {
        await openCheckoutInformation(page);
        await checkoutPage.fillCustomerInformation(customer);
        await checkoutPage.continue();

        await expect(page).toHaveURL(/checkout-step-two.html/);
        await expect(checkoutPage.finishButton).toBeVisible();
      });
    }
  });

  test.describe('Form field validation', () => {
    for (const validationCase of CheckoutValidationCases) {
      test(`checkout validation handles ${validationCase.title}`, async ({ page }) => {
        await openCheckoutInformation(page);
        await checkoutPage.fillCustomerInformation(validationCase.customer);
        await checkoutPage.continue();

        await expect(checkoutPage.errorMessage).toContainText(validationCase.expectedError);
      });
    }
  });

  test.describe('Checkout navigation', () => {
    test('cancel from information page returns to cart', async ({ page }) => {
      await openCheckoutInformation(page);
      await checkoutPage.cancel();

      await expect(page).toHaveURL(/cart.html/);
      await expect(cartPage.title).toHaveText('Your Cart');
    });

    test('cancel from overview page returns to inventory', async ({ page }) => {
      await openCheckoutOverview(page);
      await checkoutPage.cancel();

      await expect(page).toHaveURL(/inventory.html/);
      await expect(productsPage.title).toHaveText('Products');
    });

    test('back home from completion returns to inventory page', async ({ page }) => {
      await openCheckoutOverview(page);
      await checkoutPage.finish();
      await checkoutPage.backHome();

      await expect(page).toHaveURL(/inventory.html/);
      await expect(productsPage.title).toHaveText('Products');
    });
  });

  test.describe('Checkout overview', () => {
    test('overview lists the product being purchased', async ({ page }) => {
      await openCheckoutOverview(page);

      expect(await checkoutPage.getOverviewItemNames()).toEqual(['Sauce Labs Backpack']);
    });

    test('overview lists the product price', async ({ page }) => {
      await openCheckoutOverview(page);

      expect(await checkoutPage.getOverviewItemPrices()).toEqual(['$29.99']);
    });

    test('overview displays payment information label', async ({ page }) => {
      await openCheckoutOverview(page);

      await expect(checkoutPage.paymentInfoLabel).toHaveText('Payment Information:');
    });

    test('overview displays shipping information label', async ({ page }) => {
      await openCheckoutOverview(page);

      await expect(checkoutPage.shippingInfoLabel).toHaveText('Shipping Information:');
    });

    test('overview displays finish button', async ({ page }) => {
      await openCheckoutOverview(page);

      await expect(checkoutPage.finishButton).toBeVisible();
    });

    test('overview displays cancel button', async ({ page }) => {
      await openCheckoutOverview(page);

      await expect(checkoutPage.cancelButton).toBeVisible();
    });
  });

  test.describe('Order summary', () => {
    test('subtotal reflects selected product price', async ({ page }) => {
      await openCheckoutOverview(page);

      expect(await checkoutPage.getSubtotalText()).toContain('$29.99');
    });

    test('tax value is displayed', async ({ page }) => {
      await openCheckoutOverview(page);

      expect(await checkoutPage.getTaxText()).toMatch(/Tax: \$\d+\.\d{2}/);
    });

    test('total value is displayed', async ({ page }) => {
      await openCheckoutOverview(page);

      expect(await checkoutPage.getTotalText()).toMatch(/Total: \$\d+\.\d{2}/);
    });

    test('overview item count matches selected products', async ({ page }) => {
      await openCheckoutOverview(page);

      await expect(checkoutPage.overviewItems).toHaveCount(1);
    });
  });

  test.describe('Complete order', () => {
    test('finish order shows completion message', async ({ page }) => {
      await openCheckoutOverview(page);
      await checkoutPage.finish();

      await expect(checkoutPage.completeHeader).toHaveText('Thank you for your order!');
    });

    test('completion page displays back home action', async ({ page }) => {
      await openCheckoutOverview(page);
      await checkoutPage.finish();

      await expect(checkoutPage.backHomeButton).toBeVisible();
    });

    test('completed order clears the cart badge', async ({ page }) => {
      await openCheckoutOverview(page);
      await checkoutPage.finish();
      await checkoutPage.backHome();

      await expect(productsPage.shoppingCartBadge).toBeHidden();
    });
  });

  test.describe('End-to-end scenarios', () => {
    test('standard user can buy one product end to end', async ({ page }) => {
      await openCheckoutOverview(page);
      await checkoutPage.finish();

      expect(await checkoutPage.getCompleteMessage()).toBe('Thank you for your order!');
    });

    test('standard user can buy two products end to end', async ({ page }) => {
      const loginPage = new LoginPage(page);
      productsPage = new ProductsPage(page);
      cartPage = new CartPage(page);
      checkoutPage = new CheckoutPage(page);

      await loginPage.goto();
      await loginPage.login(SauceDemoUsers.standard);
      await productsPage.addProductToCart('Sauce Labs Backpack');
      await productsPage.addProductToCart('Sauce Labs Bike Light');
      await productsPage.goToCart();
      await cartPage.checkout();
      await checkoutPage.fillCustomerInformation(ValidCheckoutCustomers[0]);
      await checkoutPage.continue();

      await expect(checkoutPage.overviewItems).toHaveCount(2);

      await checkoutPage.finish();
      await expect(checkoutPage.completeHeader).toHaveText('Thank you for your order!');
    });
  });
});
