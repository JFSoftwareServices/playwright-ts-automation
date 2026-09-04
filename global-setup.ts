import { chromium, request } from '@playwright/test';
import { AuthApi } from './api/AuthApi';

const STORAGE_STATE_PATH = 'storageState.json';

/**
 * Creates the authenticated browser storage state used by the test suite.
 * Authentication is performed via API to avoid repeating the UI login flow.
 */
async function globalSetup() {
    const apiContext = await request.newContext({
        baseURL: process.env.BASE_URL,
    });

    const authApi = new AuthApi();
    const username = process.env.TEST_USER_EMAIL;
    const password = process.env.TEST_USER_PASSWORD;

    if (!username || !password) {
        throw new Error(
            'TEST_USER_EMAIL and TEST_USER_PASSWORD must be configured'
        );
    }

    const { token, userId } = await authApi.login(
        apiContext,
        username,
        password
    );

    const browser = await chromium.launch();

    const context = await browser.newContext({
        baseURL: process.env.BASE_URL,
    });

    await context.addInitScript(
        ({ tokenValue, userIdValue }) => {
            localStorage.setItem('token', tokenValue);
            localStorage.setItem('userId', userIdValue);
        },
        { tokenValue: token, userIdValue: userId }
    );

    const page = await context.newPage();

    await page.goto('/client');

    await context.storageState({
        path: STORAGE_STATE_PATH,
    });

    await browser.close();
    await apiContext.dispose();
}

export default globalSetup;
