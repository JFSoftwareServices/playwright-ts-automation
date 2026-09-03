import { Page } from '@playwright/test';

export class AuthUtils {

    async getAuthDetails(page: Page): Promise<{
        token: string;
        userId: string;
    }> {
        const auth = await page.evaluate(() => ({
            token: localStorage.getItem('token'),
            userId: localStorage.getItem('userId'),
        }));

        if (!auth.token || !auth.userId) {
            throw new Error(
                'Authentication token or userId not found in localStorage'
            );
        }

        return {
            token: auth.token,
            userId: auth.userId,
        };
    }
}