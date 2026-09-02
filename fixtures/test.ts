import { test as base } from '@playwright/test';
import { Pages } from '../pages/Pages';

type Fixtures = {
    pages: Pages;
};

export const test = base.extend<Fixtures>({
    pages: async ({ page }, use) => {
        const pages = new Pages(page);

        await use(pages);
    },
});

export { expect } from '@playwright/test';