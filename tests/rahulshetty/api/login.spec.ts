import { test, expect } from '../../../fixtures/test';
import { AuthApi } from '../../../api/AuthApi';

test.describe('Login - API', () => {
  test('returns a valid token for correct credentials', async ({ api, credentials }) => {
    const authApi = new AuthApi();
    
    const { token, userId } = await authApi.login(
      api,
      credentials.username,
      credentials.password
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