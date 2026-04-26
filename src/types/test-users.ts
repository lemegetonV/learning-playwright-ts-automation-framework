export type SauceDemoUserRole =
  | 'standard'
  | 'locked'
  | 'problem'
  | 'performance'
  | 'error'
  | 'visual';

export interface TestUser {
  readonly username: string;
  readonly password: string;
  readonly role: SauceDemoUserRole;
}
