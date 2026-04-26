import { expect, test } from '@playwright/test';

const baseURL = 'https://jsonplaceholder.typicode.com';

interface JsonPlaceholderPost {
  readonly userId: number;
  readonly id: number;
  readonly title: string;
  readonly body: string;
}

test.describe('JSONPlaceholder API @api', () => {
  test('GET /posts returns a list of posts', async ({ request }) => {
    const response = await request.get(`${baseURL}/posts`);

    expect(response.status()).toBe(200);

    const posts = (await response.json()) as JsonPlaceholderPost[];
    expect(posts.length).toBeGreaterThan(0);
    expect(posts[0]).toHaveProperty('userId');
    expect(posts[0]).toHaveProperty('id');
    expect(posts[0]).toHaveProperty('title');
    expect(posts[0]).toHaveProperty('body');
  });

  test('GET /posts/1 returns the expected post shape', async ({ request }) => {
    const response = await request.get(`${baseURL}/posts/1`);

    expect(response.status()).toBe(200);

    const post = (await response.json()) as JsonPlaceholderPost;
    expect(post.id).toBe(1);
    expect(post.userId).toBe(1);
    expect(post.title).toBeTruthy();
    expect(post.body).toBeTruthy();
  });

  test('POST /posts accepts a new post payload', async ({ request }) => {
    const newPost = {
      title: 'Test Post',
      body: 'This is a test post created by Playwright',
      userId: 1,
    };

    const response = await request.post(`${baseURL}/posts`, {
      data: newPost,
    });

    expect(response.status()).toBe(201);

    const createdPost = (await response.json()) as JsonPlaceholderPost;
    expect(createdPost.title).toBe(newPost.title);
    expect(createdPost.body).toBe(newPost.body);
    expect(createdPost.userId).toBe(newPost.userId);
    expect(createdPost.id).toBeTruthy();
  });

  test('GET /posts filters posts by user id', async ({ request }) => {
    const response = await request.get(`${baseURL}/posts?userId=1`);

    expect(response.status()).toBe(200);

    const posts = (await response.json()) as JsonPlaceholderPost[];
    expect(posts.length).toBeGreaterThan(0);

    for (const post of posts) {
      expect(post.userId).toBe(1);
    }
  });
});
