import { test, expect } from '../../fixtures/test';

// Override global authenticated state to test the UI login flow.
test.use({
    storageState: {
        cookies: [],
        origins: []
    }
});

test.describe('Login', () => {
    // LoginPage.goTo() redirects non-authenticated users to the login page.
    test.beforeEach(async ({ pages }) => {
        await pages.loginPage.goTo();
    });

    test('logs in successfully with valid credentials', async ({ pages, credentials }) => {
        await pages.loginPage.login(credentials.username, credentials.password);

        await pages.headerComponent.verifyLoggedIn();
    });

    test('shows an error with invalid credentials', async ({ page, pages }) => {

        const username = "invalid@example.com";
        const password = "invalidpassword";

        await pages.loginPage.login(username, password);

        await expect(
            page.getByRole('alert', {
                name: 'Incorrect email or password.'
            })
        ).toBeVisible();
    });
});
