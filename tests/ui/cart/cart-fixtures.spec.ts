import { expect, test } from '../../../src/fixtures/saucedemo-fixtures';

test('cart fixture provides a cart with products @fixtures', async ({ cartWithProducts }) => {
  await expect(cartWithProducts.title).toHaveText('Your Cart');

  expect(await cartWithProducts.getItemCount()).toBe(2);
  expect(await cartWithProducts.getItemNames()).toEqual([
    'Sauce Labs Backpack',
    'Sauce Labs Bike Light',
  ]);
});
