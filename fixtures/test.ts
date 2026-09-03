// fixtures/test.ts

import { test as base, expect, APIRequestContext } from '@playwright/test';
import { Pages } from '../pages/Pages';

type Fixtures = {
    pages: Pages;
    api: APIRequestContext;
};

export const test = base.extend<Fixtures>({
    pages: async ({ page }, use) => {
        await use(new Pages(page));
    },

    api: async ({ playwright }, use) => {
        const api = await playwright.request.newContext({
            baseURL: 'https://rahulshettyacademy.com',
        });

        await use(api);

        await api.dispose();
    },
});

export { expect };