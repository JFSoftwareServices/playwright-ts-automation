import { chromium, expect, request } from '@playwright/test';
import { validLoginData } from './test-data/login-data';

const STORAGE_STATE_PATH = 'storageState.json';
/* Playwright global setup: logs in once via the app's auth API, injects the 
 * resulting JWT into localStorage, navigates to the authenticated dashboard, 
 * and saves the resulting browser state to storageState.json. 
 * All tests can then start already authenticated without repeating the UI 
 * login flow. 
 */
async function globalSetup() {
    // Create API context
    const apiContext = await request.newContext();

    // Login via API
    const loginResponse = await apiContext.post(
        'https://rahulshettyacademy.com/api/ecom/auth/login',
        {
            data: {
                userEmail: validLoginData.username,
                userPassword: validLoginData.password,
            },
        }
    );

    expect(loginResponse.ok()).toBeTruthy();

    // Extract JWT token
    const { token } = await loginResponse.json();

    // Launch browser and create context
    const browser = await chromium.launch();
    const context = await browser.newContext();

    // Inject JWT into localStorage
    await context.addInitScript(
        ({ tokenValue }) => {
            localStorage.setItem('token', tokenValue);
        },
        { tokenValue: token }
    );

    // Create page
    const page = await context.newPage();

    // Navigate to the authenticated dashboard so the application 
    // initialises using the JWT before the storage state is saved.
    await page.goto(
        'https://rahulshettyacademy.com/client/#/dashboard/dash'
    );

    // Save authentication state
    await context.storageState({
        path: STORAGE_STATE_PATH,
    });

    // Clean up
    await browser.close();
    await apiContext.dispose();
}

export default globalSetup;
