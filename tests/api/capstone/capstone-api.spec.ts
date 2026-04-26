import { expect, test } from '@playwright/test';

import type { ApiResult, CapstoneProduct } from '../../../src/types/capstone';
import type { SauceDemoProductName } from '../../../src/types/products';
import {
  CapstoneProductNames,
  CapstoneProducts,
} from '../../../src/utils/capstone-data';
import { SauceDemoUsers } from '../../../src/utils/test-users';

type AuthResponse = {
  readonly authenticated: boolean;
  readonly role?: string;
  readonly error?: string;
};

type CartSummary = {
  readonly items: readonly CapstoneProduct[];
  readonly subtotal: number;
};

function authenticate(username: string, password: string): ApiResult<AuthResponse> {
  const users = Object.values(SauceDemoUsers);
  const user = users.find((candidate) => candidate.username === username);

  if (!user || user.password !== password) {
    return {
      status: 401,
      body: { authenticated: false, error: 'invalid_credentials' },
    };
  }

  if (user.role === 'locked') {
    return {
      status: 423,
      body: { authenticated: false, error: 'locked_out' },
    };
  }

  return {
    status: 200,
    body: { authenticated: true, role: user.role },
  };
}

function getProductByName(productName: SauceDemoProductName): ApiResult<CapstoneProduct> {
  const product = CapstoneProducts.find((candidate) => candidate.name === productName);

  if (!product) {
    return {
      status: 404,
      body: CapstoneProducts[0],
    };
  }

  return {
    status: 200,
    body: product,
  };
}

function buildCartSummary(productNames: readonly SauceDemoProductName[]): ApiResult<CartSummary> {
  const items = productNames.map((productName) => getProductByName(productName).body);
  const subtotal = items.reduce((sum, product) => sum + Number(product.price.replace('$', '')), 0);

  return {
    status: 200,
    body: {
      items,
      subtotal,
    },
  };
}

test.describe('Capstone API-style coverage', () => {
  test.describe('Authentication API-style tests', () => {
    test('standard user credentials return an authenticated response', async () => {
      const response = authenticate(SauceDemoUsers.standard.username, SauceDemoUsers.standard.password);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ authenticated: true, role: 'standard' });
    });

    test('invalid credentials return an unauthorized response', async () => {
      const response = authenticate('not_a_user', 'bad_password');

      expect(response.status).toBe(401);
      expect(response.body).toEqual({ authenticated: false, error: 'invalid_credentials' });
    });
  });

  test.describe('Product API-style tests', () => {
    test('product list returns all six products', async () => {
      expect(CapstoneProducts).toHaveLength(6);
    });

    test('product lookup by name returns expected product contract', async () => {
      const response = getProductByName('Sauce Labs Backpack');

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        name: 'Sauce Labs Backpack',
        price: '$29.99',
      });
    });

    test('every product price uses currency formatting', async () => {
      for (const product of CapstoneProducts) {
        expect(product.price).toMatch(/^\$\d+\.\d{2}$/);
      }
    });

    test('product names can be sorted A to Z', async () => {
      expect([...CapstoneProductNames].sort()).toEqual(CapstoneProductNames);
    });

    test('unknown product lookup returns not found status', async () => {
      const missingProduct = 'Missing Product' as SauceDemoProductName;
      const response = getProductByName(missingProduct);

      expect(response.status).toBe(404);
    });
  });

  test.describe('Cart API-style tests', () => {
    test('cart summary can contain a single product', async () => {
      const response = buildCartSummary(['Sauce Labs Backpack']);

      expect(response.status).toBe(200);
      expect(response.body.items).toHaveLength(1);
    });

    test('cart summary can contain multiple products', async () => {
      const response = buildCartSummary(['Sauce Labs Backpack', 'Sauce Labs Bike Light']);

      expect(response.body.items.map((item) => item.name)).toEqual([
        'Sauce Labs Backpack',
        'Sauce Labs Bike Light',
      ]);
    });

    test('cart summary subtotal is calculated from product prices', async () => {
      const response = buildCartSummary(['Sauce Labs Backpack', 'Sauce Labs Bike Light']);

      expect(response.body.subtotal).toBe(39.98);
    });

    test('empty cart summary has no items and zero subtotal', async () => {
      const response = buildCartSummary([]);

      expect(response.body.items).toEqual([]);
      expect(response.body.subtotal).toBe(0);
    });

    test('removing a product from cart data leaves the remaining item', async () => {
      const cart = ['Sauce Labs Backpack', 'Sauce Labs Bike Light'] as SauceDemoProductName[];
      const remainingCart = cart.filter((productName) => productName !== 'Sauce Labs Backpack');

      expect(buildCartSummary(remainingCart).body.items.map((item) => item.name)).toEqual([
        'Sauce Labs Bike Light',
      ]);
    });
  });

  test.describe('User API-style tests', () => {
    test('all configured users have usernames and passwords', async () => {
      for (const user of Object.values(SauceDemoUsers)) {
        expect(user.username).toBeTruthy();
        expect(user.password).toBeTruthy();
      }
    });

    test('locked user credentials return locked status', async () => {
      const response = authenticate(SauceDemoUsers.locked.username, SauceDemoUsers.locked.password);

      expect(response.status).toBe(423);
      expect(response.body.error).toBe('locked_out');
    });

    test('configured user roles are unique', async () => {
      const roles = Object.values(SauceDemoUsers).map((user) => user.role);

      expect(new Set(roles).size).toBe(roles.length);
    });
  });
});
