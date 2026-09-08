import { test, expect } from '../../../fixtures/test';
import { AuthApi } from '../../../api/AuthApi';

test.describe('Login - API', () => {
  test('returns a valid token for correct credentials', async ({ api }) => {
    const authApi = new AuthApi();
    const username = process.env.TEST_USER_EMAIL;
    const password = process.env.TEST_USER_PASSWORD;

    if (!username || !password) {
      throw new Error('TEST_USER_EMAIL and TEST_USER_PASSWORD must be set');
    }
    
    const { token, userId } = await authApi.login(
      api,
      username,
      password
    );

    expect(token).toMatch(/^[\w-]+\.[\w-]+\.[\w-]+$/);
    expect(userId).toMatch(/^[a-f0-9]{24}$/);
  });

  test('rejects incorrect credentials', async ({ api }) => {
    const authApi = new AuthApi();
    const username = "invalid@example.com";
    const password = "invalidpassword";
    await expect(
      authApi.login(api, username, password)
    ).rejects.toThrow();
  });
});