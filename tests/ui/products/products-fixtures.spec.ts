import { expect, test } from '../../../src/fixtures/saucedemo-fixtures';

test('standard user can add a product with fixture setup @fixtures', async ({ productsPage }) => {
  await productsPage.addProductToCart('Sauce Labs Backpack');

  await expect(productsPage.shoppingCartBadge).toHaveText('1');
  expect(await productsPage.isProductInCart('Sauce Labs Backpack')).toBe(true);
});
