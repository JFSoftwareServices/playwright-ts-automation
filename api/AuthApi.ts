import { APIRequestContext, expect } from '@playwright/test';

export class AuthApi {

    async login(
        api: APIRequestContext,
        username: string,
        password: string
    ): Promise<{ token: string; userId: string }> {

        const response = await api.post('/api/ecom/auth/login', {
            data: {
                userEmail: username,
                userPassword: password,
            },
        });

        expect(response.ok()).toBe(true);

        const data = await response.json();

        return {
            token: data.token,
            userId: data.userId,
        };
    }
}