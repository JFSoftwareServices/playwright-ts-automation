import { test as base, expect, APIRequestContext } from '@playwright/test';
import { Pages } from '../pages/Pages';

type Fixtures = {
    pages: Pages;
    api: APIRequestContext;
    credentials: { username: string; password: string };
};

export const test = base.extend<Fixtures>({
    pages: async ({ page }, use) => {
        await use(new Pages(page));
    },

    api: async ({ playwright }, use) => {
        const api = await playwright.request.newContext({
            baseURL: process.env.BASE_URL,
        });

        await use(api);

        await api.dispose();
    },

    credentials: async ({}, use) => {
        const username = process.env.TEST_USER_EMAIL;
        const password = process.env.TEST_USER_PASSWORD;

        if (!username || !password) {
            throw new Error('TEST_USER_EMAIL and TEST_USER_PASSWORD must be configured');
        }

        await use({ username, password });
    },
});

export { expect };