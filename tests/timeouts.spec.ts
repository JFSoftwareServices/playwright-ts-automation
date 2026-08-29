import { test, expect } from '@playwright/test';

/**
 * ============================================================
 * PLAYWRIGHT TIMEOUT DEMONSTRATION TESTS
 * ============================================================
 *
 * These tests demonstrate:
 *
 * 1. Global assertion timeout
 * 2. Step-level assertion timeout
 * 3. Global test timeout
 * 4. Step-level test timeout
 * 5. Global action timeout
 * 6. Step-level action timeout
 * 7. The difference between action and assertion timeouts
 * 8. Why waitForTimeout() should generally be avoided
 *
 * IMPORTANT:
 *
 * Timeout values in these tests are deliberately small so that
 * the behaviour can be demonstrated quickly.
 *
 * In a real framework, use sensible values based on the
 * application's response times.
 */


/**
 * ============================================================
 * 1. GLOBAL ASSERTION TIMEOUT
 * ============================================================
 *
 * playwright.config.ts:
 *
 * expect: {
 *     timeout: 5000
 * }
 *
 * This means every Playwright assertion gets up to 5 seconds
 * by default to become true.
 *
 * Example:
 *
 * await expect(locator).toBeVisible();
 *
 * Playwright does NOT simply check once.
 *
 * It repeatedly checks the condition until:
 *
 *     1. The condition becomes true
 *                       OR
 *     2. The assertion timeout expires.
 *
 * The global value can be overridden for an individual
 * assertion.
 */
test('Global assertion timeout', async ({ page }) => {

    await page.goto('https://example.com');

    /*
     * No timeout is specified here.
     *
     * Therefore Playwright uses the global expect timeout
     * from playwright.config.ts.
     *
     * For example:
     *
     * expect: {
     *     timeout: 5000
     * }
     *
     * This assertion will wait/retry for up to 5 seconds.
     */

    await expect(
        page.getByRole('heading', {
            name: 'Example Domain'
        })
    ).toBeVisible();
});


/**
 * ============================================================
 * 2. STEP-LEVEL ASSERTION TIMEOUT
 * ============================================================
 *
 * A particular assertion can override the global timeout.
 *
 * Global:
 *
 *     expect.timeout = 5000
 *
 * This assertion:
 *
 *     timeout = 10000
 *
 * Therefore this assertion gets 10 seconds instead of 5.
 */
test('Step-level assertion timeout', async ({ page }) => {

    await page.goto('https://example.com');

    await expect(
        page.getByRole('heading', {
            name: 'Example Domain'
        })
    ).toBeVisible({
        timeout: 10_000
    });
});


/**
 * ============================================================
 * 3. DEMONSTRATE AN ASSERTION TIMEOUT
 * ============================================================
 *
 * test.fail() tells Playwright that this test is expected
 * to fail.
 *
 * This is useful when demonstrating timeout behaviour without
 * making the entire test suite appear broken.
 */
test.fail('Assertion timeout demonstration', async ({ page }) => {

    await page.goto('https://example.com');

    /*
     * There is no heading called "Dashboard".
     *
     * Playwright will repeatedly check the assertion.
     *
     * The assertion will eventually fail when its timeout
     * expires.
     */

    await expect(
        page.getByRole('heading', {
            name: 'Dashboard'
        })
    ).toBeVisible({
        timeout: 2_000
    });
});


/**
 * ============================================================
 * 4. TEST GLOBAL TIMEOUT
 * ============================================================
 *
 * playwright.config.ts might contain:
 *
 *     timeout: 30000
 *
 * This is the maximum duration allowed for the test.
 *
 * IMPORTANT:
 *
 * This is NOT the assertion timeout.
 *
 * It applies to the test as a whole.
 *
 * Conceptually:
 *
 * TEST
 *  |
 *  +-- beforeEach
 *  |
 *  +-- goto()
 *  |
 *  +-- fill()
 *  |
 *  +-- click()
 *  |
 *  +-- expect()
 *  |
 *  +-- other operations
 *  |
 *  +-- afterEach
 *
 * The test timeout provides the overall limit.
 */
test('Test timeout example', async ({ page }) => {

    /*
     * Override the configured test timeout for this test.
     *
     * This test has a maximum duration of 5 seconds.
     */
    test.setTimeout(5_000);

    await page.goto('https://example.com');

    /*
     * Deliberately sleep for 10 seconds.
     *
     * Because the entire test has a 5-second timeout,
     * Playwright will terminate the test before this
     * operation completes.
     *
     * This is ONLY being done to demonstrate test timeout.
     */
    await page.waitForTimeout(10_000);
});


/**
 * ============================================================
 * 5. GLOBAL ACTION TIMEOUT
 * ============================================================
 *
 * playwright.config.ts:
 *
 * use: {
 *     actionTimeout: 10000
 * }
 *
 * This controls how long Playwright waits for an individual
 * action to become actionable.
 *
 * Examples of actions:
 *
 *     click()
 *     fill()
 *     check()
 *     uncheck()
 *     hover()
 *     selectOption()
 *     press()
 *
 * It is NOT the timeout for the entire test.
 */
test('Global action timeout', async ({ page }) => {

    await page.goto('https://example.com');

    /*
     * No timeout is specified.
     *
     * Therefore the click uses the global action timeout.
     *
     * For example:
     *
     *     actionTimeout: 10000
     *
     * The click can wait up to 10 seconds for the
     * action to become possible.
     */
    await page.getByRole('link', {
        name: 'More information...'
    }).click();
});


/**
 * ============================================================
 * 6. STEP-LEVEL ACTION TIMEOUT
 * ============================================================
 *
 * An individual action can override the global action timeout.
 *
 * Global:
 *
 *     actionTimeout = 10000
 *
 * This click:
 *
 *     timeout = 2000
 *
 * Therefore this particular click gets only 2 seconds.
 */
test('Step-level action timeout', async ({ page }) => {

    await page.goto('https://example.com');

    await page.getByRole('link', {
        name: 'More information...'
    }).click({
        timeout: 2_000
    });
});


/**
 * ============================================================
 * 7. DEMONSTRATE AN ACTION TIMEOUT
 * ============================================================
 *
 * Again, test.fail() is used because failure is intentional.
 */
test.fail('Action timeout demonstration', async ({ page }) => {

    await page.goto('https://example.com');

    /*
     * There is no Login button on example.com.
     *
     * Playwright will wait for the element/actionability
     * checks before eventually failing.
     *
     * We deliberately give the action only 2 seconds.
     */
    await page.getByRole('button', {
        name: 'Login'
    }).click({
        timeout: 2_000
    });
});


/**
 * ============================================================
 * 8. ACTION TIMEOUT VS ASSERTION TIMEOUT
 * ============================================================
 *
 * These are TWO DIFFERENT timeout mechanisms.
 *
 * ACTION:
 *
 *     click({ timeout: 3000 })
 *
 * means:
 *
 *     "Allow this click operation up to 3 seconds."
 *
 *
 * ASSERTION:
 *
 *     expect(locator).toBeVisible({ timeout: 8000 })
 *
 * means:
 *
 *     "Keep retrying this assertion for up to 8 seconds."
 */
test('Action timeout versus assertion timeout', async ({ page }) => {

    await page.goto('https://example.com');

    /*
     * ACTION TIMEOUT
     *
     * Only this click has a 3-second timeout.
     */
    await page.getByRole('link', {
        name: 'More information...'
    }).click({
        timeout: 3_000
    });


    /*
     * ASSERTION TIMEOUT
     *
     * Only this assertion has an 8-second timeout.
     */
    await expect(
        page.getByRole('heading', {
            name: 'Example Domain'
        })
    ).toBeVisible({
        timeout: 8_000
    });
});


/**
 * ============================================================
 * 9. WAIT FOR TIMEOUT / FIXED SLEEP
 * ============================================================
 *
 * waitForTimeout() is NOT the same thing as an assertion
 * timeout or action timeout.
 *
 * This:
 *
 *     await page.waitForTimeout(5000);
 *
 * means:
 *
 *     "Always wait exactly 5 seconds."
 *
 * It does NOT mean:
 *
 *     "Wait up to 5 seconds for the element."
 *
 * In normal automation code, fixed sleeps should generally
 * be avoided because they make tests slower and can still
 * be unreliable.
 */
test('Avoid fixed waits where possible', async ({ page }) => {

    await page.goto('https://example.com');

    /*
     * NOT recommended for synchronisation:
     *
     * await page.waitForTimeout(5000);
     */

    /*
     * Prefer a condition-based assertion.
     *
     * Playwright waits only as long as necessary.
     */
    await expect(
        page.getByRole('heading', {
            name: 'Example Domain'
        })
    ).toBeVisible();
});