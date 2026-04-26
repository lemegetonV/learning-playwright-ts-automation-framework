import { expect, test } from '@playwright/test';

import { LoginPage } from '../../../../src/page-objects/LoginPage';
import { ProductsPage } from '../../../../src/page-objects/ProductsPage';
import { ProductSortOption } from '../../../../src/types/products';
import {
  CapstoneProductNames,
  CapstoneProductPriceByName,
  CapstoneProducts,
} from '../../../../src/utils/capstone-data';
import { SauceDemoUsers } from '../../../../src/utils/test-users';

test.describe('Capstone product browsing coverage', () => {
  let productsPage: ProductsPage;

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    productsPage = new ProductsPage(page);

    await loginPage.goto();
    await loginPage.login(SauceDemoUsers.standard);
  });

  test.describe('Product display verification', () => {
    test('all products are displayed', async () => {
      await expect(productsPage.inventoryItems).toHaveCount(6);
    });

    test('product count helper returns the expected catalog size', async () => {
      expect(await productsPage.getProductCount()).toBe(6);
    });

    test('products page title is displayed', async () => {
      await expect(productsPage.title).toHaveText('Products');
    });

    test('product container is visible', async () => {
      await expect(productsPage.inventoryContainer).toBeVisible();
    });

    test('all expected product names are present', async () => {
      expect(await productsPage.getProductNames()).toEqual(CapstoneProductNames);
    });

    test('all product prices are present', async () => {
      const prices = await productsPage.getProductPrices();

      expect(prices).toHaveLength(6);
      for (const price of prices) {
        expect(price).toMatch(/^\$\d+\.\d{2}$/);
      }
    });
  });

  test.describe('Sorting functionality', () => {
    test('default sort is name A to Z', async () => {
      expect(await productsPage.getProductNames()).toEqual([...CapstoneProductNames].sort());
    });

    test('sort A to Z keeps names ascending', async () => {
      await productsPage.sortBy(ProductSortOption.NameAToZ);

      expect(await productsPage.getProductNames()).toEqual([...CapstoneProductNames].sort());
    });

    test('sort Z to A orders names descending', async () => {
      await productsPage.sortBy(ProductSortOption.NameZToA);

      expect(await productsPage.getProductNames()).toEqual([...CapstoneProductNames].sort().reverse());
    });

    test('sort price low to high puts the onesie first', async () => {
      await productsPage.sortBy(ProductSortOption.PriceLowToHigh);

      expect((await productsPage.getProductNames())[0]).toBe('Sauce Labs Onesie');
    });

    test('sort price high to low puts the fleece jacket first', async () => {
      await productsPage.sortBy(ProductSortOption.PriceHighToLow);

      expect((await productsPage.getProductNames())[0]).toBe('Sauce Labs Fleece Jacket');
    });
  });

  test.describe('Add to cart operations', () => {
    test('single product can be added to cart', async () => {
      await productsPage.addProductToCart('Sauce Labs Backpack');

      await expect(productsPage.shoppingCartBadge).toHaveText('1');
    });

    test('multiple products can be added to cart', async () => {
      await productsPage.addProductToCart('Sauce Labs Backpack');
      await productsPage.addProductToCart('Sauce Labs Bike Light');

      await expect(productsPage.shoppingCartBadge).toHaveText('2');
    });

    test('each product can be added through its own product card', async () => {
      for (const productName of CapstoneProductNames) {
        await productsPage.addProductToCart(productName);
      }

      await expect(productsPage.shoppingCartBadge).toHaveText('6');
    });

    test('added product button changes to remove', async () => {
      await productsPage.addProductToCart('Sauce Labs Backpack');

      expect(await productsPage.isProductInCart('Sauce Labs Backpack')).toBe(true);
    });

    test('cart badge reflects the exact number of added products', async () => {
      await productsPage.addProductToCart('Sauce Labs Backpack');
      await productsPage.addProductToCart('Sauce Labs Bike Light');
      await productsPage.addProductToCart('Sauce Labs Bolt T-Shirt');

      expect(await productsPage.getCartItemCount()).toBe(3);
    });
  });

  test.describe('Remove from cart operations', () => {
    test('single product can be removed from product page', async () => {
      await productsPage.addProductToCart('Sauce Labs Backpack');
      await productsPage.removeProductFromCart('Sauce Labs Backpack');

      expect(await productsPage.getCartItemCount()).toBe(0);
    });

    test('cart badge decrements when one of two products is removed', async () => {
      await productsPage.addProductToCart('Sauce Labs Backpack');
      await productsPage.addProductToCart('Sauce Labs Bike Light');
      await productsPage.removeProductFromCart('Sauce Labs Backpack');

      await expect(productsPage.shoppingCartBadge).toHaveText('1');
    });
  });

  test.describe('Product navigation', () => {
    test('user can navigate to a product detail page', async ({ page }) => {
      await productsPage.openProductDetails('Sauce Labs Backpack');

      await expect(page).toHaveURL(/inventory-item.html/);
      await expect(page.locator('.inventory_details_name')).toHaveText('Sauce Labs Backpack');
    });

    test('user can navigate to the cart from products page', async ({ page }) => {
      await productsPage.goToCart();

      await expect(page).toHaveURL(/cart.html/);
    });
  });

  test.describe('Product information', () => {
    test('product names displayed match capstone data', async () => {
      expect(await productsPage.getProductNames()).toEqual(CapstoneProductNames);
    });

    test('product prices displayed match capstone data', async () => {
      for (const product of CapstoneProducts) {
        expect(await productsPage.getProductPrice(product.name)).toBe(CapstoneProductPriceByName[product.name]);
      }
    });

    test('product descriptions are populated', async () => {
      const descriptions = await productsPage.getProductDescriptions();

      expect(descriptions).toHaveLength(6);
      for (const description of descriptions) {
        expect(description.length).toBeGreaterThan(10);
      }
    });
  });

  test.describe('User menu', () => {
    test('user can log out from the product page menu', async ({ page }) => {
      await productsPage.logout();

      await expect(page).toHaveURL(/saucedemo\.com\/?$/);
      await expect(page.getByRole('button', { name: 'Login' })).toBeVisible();
    });
  });
});
