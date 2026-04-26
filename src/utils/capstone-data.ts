import type {
  CapstoneProduct,
  CheckoutValidationCase,
  InvalidLoginCase,
  ValidLoginCase,
} from '../types/capstone';
import type { CheckoutCustomer } from '../types/checkout';
import type { SauceDemoProductName } from '../types/products';
import { SauceDemoUsers } from './test-users';

export const CapstoneProducts = [
  {
    name: 'Sauce Labs Backpack',
    price: '$29.99',
    description: 'carry.allTheThings() with the sleek, streamlined Sly Pack',
  },
  {
    name: 'Sauce Labs Bike Light',
    price: '$9.99',
    description: "A red light isn't the desired state in testing but it sure helps when riding",
  },
  {
    name: 'Sauce Labs Bolt T-Shirt',
    price: '$15.99',
    description: 'Get your testing superhero on with the Sauce Labs bolt T-shirt',
  },
  {
    name: 'Sauce Labs Fleece Jacket',
    price: '$49.99',
    description: 'fleece jacket that will keep you warm while testing',
  },
  {
    name: 'Sauce Labs Onesie',
    price: '$7.99',
    description: 'Rib snap infant onesie for the junior automation engineer',
  },
  {
    name: 'Test.allTheThings() T-Shirt (Red)',
    price: '$15.99',
    description: 'This classic Sauce Labs t-shirt is perfect to wear when cozying up',
  },
] as const satisfies readonly CapstoneProduct[];

export const CapstoneProductNames = CapstoneProducts.map((product) => product.name);

export const CapstoneProductPriceByName = Object.fromEntries(
  CapstoneProducts.map((product) => [product.name, product.price]),
) as Record<SauceDemoProductName, string>;

export const ValidLoginCases: readonly ValidLoginCase[] = [
  { title: 'standard user', user: SauceDemoUsers.standard },
  { title: 'performance glitch user', user: SauceDemoUsers.performance },
  { title: 'problem user', user: SauceDemoUsers.problem },
  { title: 'visual user', user: SauceDemoUsers.visual },
  { title: 'error user', user: SauceDemoUsers.error },
];

export const InvalidCredentialCases: readonly InvalidLoginCase[] = [
  {
    title: 'locked out user',
    username: SauceDemoUsers.locked.username,
    password: SauceDemoUsers.locked.password,
    expectedError: 'Epic sadface: Sorry, this user has been locked out.',
  },
  {
    title: 'invalid username',
    username: 'invalid_user',
    password: SauceDemoUsers.standard.password,
    expectedError: 'Epic sadface: Username and password do not match any user in this service',
  },
  {
    title: 'invalid password',
    username: SauceDemoUsers.standard.username,
    password: 'wrong_password',
    expectedError: 'Epic sadface: Username and password do not match any user in this service',
  },
  {
    title: 'wrong username format',
    username: 'standard_user@example.com',
    password: SauceDemoUsers.standard.password,
    expectedError: 'Epic sadface: Username and password do not match any user in this service',
  },
  {
    title: 'SQL injection attempt',
    username: "admin' OR '1'='1",
    password: "admin' OR '1'='1",
    expectedError: 'Epic sadface: Username and password do not match any user in this service',
  },
  {
    title: 'XSS attempt',
    username: '<script>alert("XSS")</script>',
    password: SauceDemoUsers.standard.password,
    expectedError: 'Epic sadface: Username and password do not match any user in this service',
  },
  {
    title: 'case-sensitive username',
    username: 'STANDARD_USER',
    password: SauceDemoUsers.standard.password,
    expectedError: 'Epic sadface: Username and password do not match any user in this service',
  },
];

export const EmptyFieldCases: readonly InvalidLoginCase[] = [
  {
    title: 'empty username',
    username: '',
    password: SauceDemoUsers.standard.password,
    expectedError: 'Epic sadface: Username is required',
  },
  {
    title: 'empty password',
    username: SauceDemoUsers.standard.username,
    password: '',
    expectedError: 'Epic sadface: Password is required',
  },
];

export const ValidCheckoutCustomers: readonly CheckoutCustomer[] = [
  { firstName: 'Asha', lastName: 'Tester', postalCode: '560001' },
  { firstName: 'Ravi', lastName: 'Automation', postalCode: '110001' },
  { firstName: 'Mira', lastName: 'Quality', postalCode: '400001' },
  { firstName: 'Dev', lastName: 'Engineer', postalCode: '700001' },
];

export const CheckoutValidationCases: readonly CheckoutValidationCase[] = [
  {
    title: 'missing first name',
    customer: { firstName: '', lastName: 'Tester', postalCode: '560001' },
    expectedError: 'Error: First Name is required',
  },
  {
    title: 'missing last name',
    customer: { firstName: 'Asha', lastName: '', postalCode: '560001' },
    expectedError: 'Error: Last Name is required',
  },
  {
    title: 'missing postal code',
    customer: { firstName: 'Asha', lastName: 'Tester', postalCode: '' },
    expectedError: 'Error: Postal Code is required',
  },
  {
    title: 'all fields blank',
    customer: { firstName: '', lastName: '', postalCode: '' },
    expectedError: 'Error: First Name is required',
  },
  {
    title: 'first name whitespace only',
    customer: { firstName: ' ', lastName: 'Tester', postalCode: '560001' },
    expectedError: 'Error: First Name is required',
  },
];
