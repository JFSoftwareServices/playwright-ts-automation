import { test, expect } from '@playwright/test';

test.describe('Angular Practice Form - Special Locators & Timeouts', () => {

    test.beforeEach(async ({ page }) => {
        await page.goto('https://rahulshettyacademy.com/angularpractice/');

        const iceCreamCheckbox = page.getByLabel('Check me out if you Love IceCreams!');
        await iceCreamCheckbox.click();
        await expect(iceCreamCheckbox).toBeChecked();

        const employedCheckbox = page.getByLabel('Employed');
        await employedCheckbox.check();
        await expect(employedCheckbox).toBeChecked();

        const genderDropdown = page.getByLabel('Gender');
        await genderDropdown.selectOption('Female');
        await expect(genderDropdown).toHaveValue('Female');

        const passwordField = page.getByPlaceholder('Password');
        await passwordField.fill('abc123');
        await expect(passwordField).toHaveValue('abc123');
    });

    test('submits form using role, label, and placeholder locators', async ({ page }) => {
        await page.getByRole('button', { name: 'Submit' }).click();

        // Default expect assertion timeout is 5s; override per-assertion via {timeout: ms}.
        await expect(page.getByText('Success! The Form has been submitted successfully!.')).toBeVisible({
            timeout: 10_000,
        });

        await page.getByRole('link', { name: 'Shop' }).click();
        await page.locator('app-card').filter({ hasText: 'Nokia Edge' }).getByRole('button').click();
    });

    test('uses a custom expect timeout instance for slower assertions', async ({ page }) => {
        // expect.configure() creates a reusable expect instance with its own default
        // timeout (9s here) — this is separate from the test's own overall timeout.
        const slowExpect = expect.configure({ timeout: 9_000 });

        await page.getByRole('button', { name: 'Submit' }).click({ timeout: 7_000 });

        await slowExpect(page.getByText('Success! The Form has been submitted successfully!.')).toBeVisible();
        await page.getByRole('link', { name: 'Shop' }).click();
        await slowExpect(page.locator('.my-4').first()).toHaveText('Shop Name');

        await page.locator('app-card').filter({ hasText: 'Nokia Edge' }).getByRole('button').click();
    });

});