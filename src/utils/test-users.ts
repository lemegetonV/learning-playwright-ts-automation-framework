import 'dotenv/config';

import type { SauceDemoUserRole, TestUser } from '../types/test-users';

const sauceDemoPassword = process.env.SAUCEDEMO_PASSWORD ?? 'secret_sauce';

function buildSauceDemoUser(
  role: SauceDemoUserRole,
  envKey: string,
  fallbackUsername: string,
): TestUser {
  return {
    role,
    username: process.env[envKey] ?? fallbackUsername,
    password: sauceDemoPassword,
  };
}

export const SauceDemoUsers = {
  standard: buildSauceDemoUser('standard', 'SAUCEDEMO_STANDARD_USER', 'standard_user'),
  locked: buildSauceDemoUser('locked', 'SAUCEDEMO_LOCKED_USER', 'locked_out_user'),
  problem: buildSauceDemoUser('problem', 'SAUCEDEMO_PROBLEM_USER', 'problem_user'),
  performance: buildSauceDemoUser(
    'performance',
    'SAUCEDEMO_PERFORMANCE_USER',
    'performance_glitch_user',
  ),
  error: buildSauceDemoUser('error', 'SAUCEDEMO_ERROR_USER', 'error_user'),
  visual: buildSauceDemoUser('visual', 'SAUCEDEMO_VISUAL_USER', 'visual_user'),
} as const satisfies Record<SauceDemoUserRole, TestUser>;
