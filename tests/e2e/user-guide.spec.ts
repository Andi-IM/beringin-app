import { test, expect } from '@playwright/test'

test.describe('User Guide: Comprehensive Feature Verification', () => {
  test.setTimeout(120000) // 2 minutes timeout for the whole flow

  test('should complete the full learning and management flow', async ({
    page,
  }) => {
    console.log('--- Starting User Guide E2E Verification ---')

    // 1. Auth Flow: Login or Register
    console.log('Step 1: Authenticating')
    const email = `andii@example.com`
    const password = 'password123'

    await page.goto('/login')
    await page.getByPlaceholder('you@example.com').fill(email)
    await page.getByPlaceholder('••••••••').fill(password)
    await page.getByRole('button', { name: 'Masuk', exact: true }).click()

    // Check if we reached dashboard or need to register
    const isLoginSuccessful = await page
      .waitForURL(/.*dashboard/, { timeout: 5000 })
      .then(() => true)
      .catch(() => false)

    if (!isLoginSuccessful) {
      console.log('Login failed or user not found, attempting registration...')
      await page.goto('/register')
      await page.getByPlaceholder('you@example.com').fill(email)
      await page
        .locator('input[name="password"]')
        .fill(email === 'andii@example.com' ? 'password123' : password) // Ensure password matches intention
      await page
        .locator('input[name="confirmPassword"]')
        .fill(email === 'andii@example.com' ? 'password123' : password)
      await page.getByRole('button', { name: 'Daftar', exact: true }).click()

      console.log('Waiting for registration/dashboard...')
      await Promise.race([
        expect(
          page.getByText(/Berhasil|Sukses|Sudah terdaftar/i),
        ).toBeVisible(),
        page.waitForURL(/.*dashboard/),
      ])

      // If not auto-logged in, login again
      if (!page.url().includes('dashboard')) {
        console.log(`Step 2: Manual login required. Current URL: ${page.url()}`)
        await page.goto('/login')
        console.log(`Navigated to /login. Final URL: ${page.url()}`)
        await page.getByPlaceholder('you@example.com').fill(email)
        await page.getByPlaceholder('••••••••').fill(password)
        await page.getByRole('button', { name: 'Masuk', exact: true }).click()
      }
    }

    await expect(page).toHaveURL(/.*dashboard/)
    console.log('Successfully reached Dashboard')

    // 3. Admin Panel - CREATE DATA FIRST (to avoid empty session)
    console.log('Step 3: Creating Content via Admin Panel')
    await page.goto('/admin')
    await expect(page.getByRole('link', { name: 'Konsep' })).toBeVisible()

    await page.getByRole('link', { name: 'Konsep' }).click()
    await expect(page).toHaveURL(/.*admin\/concepts/)
    await expect(page.locator('h1')).toContainText('Konsep')

    // Create Concept
    console.log('Creating new concept...')
    await page.getByRole('link', { name: 'Create Concept' }).click()

    const conceptTitle = `Konsep E2E ${Date.now()}`
    await page.getByLabel(/Title|Judul/i).fill(conceptTitle)
    await page.getByLabel(/Category|Kategori/i).fill('E2E Test')
    await page
      .getByLabel(/Description|Deskripsi/i)
      .fill('Dibuat via Playwright')

    await page.getByRole('button', { name: /Save|Simpan/i }).click()

    await expect(page).toHaveURL(/.*admin\/concepts/)
    await expect(page.getByText(conceptTitle)).toBeVisible()

    // Add Question to Concept
    console.log('Adding question to concept...')
    // Wait for the new concept to appear in the list using a more specific locator if possible, or just text
    await expect(page.getByText(conceptTitle)).toBeVisible({ timeout: 10000 })

    await page.getByText(conceptTitle).first().click() // Or find Edit button in row
    // Use locator to click Edit button in the row containing the title
    await page
      .getByRole('row')
      .filter({ hasText: conceptTitle })
      .getByRole('link', { name: 'Edit' })
      .click()

    await expect(page.getByText('Questions')).toBeVisible()
    await page.getByRole('button', { name: 'Add Question' }).click()

    await page.locator('input[name="prompt"]').fill('Apa ibukota Indonesia?')
    await page.locator('textarea[name="answerCriteria"]').fill('Jakarta')
    await page.getByRole('button', { name: 'Save Question' }).click()

    await expect(page.getByText('Apa ibukota Indonesia?')).toBeVisible()
    console.log('Question added successfully')

    // 4. Dashboard Verification
    console.log('Step 4: Verifying Dashboard Stats')
    await page.goto('/dashboard')
    await expect(page.getByText('Dashboard Beringin')).toBeVisible()
    // Need to reload or wait for stats to update if strictly real-time, but for now we check visibility

    // 5. Study Session
    console.log('Step 5: Starting Study Session')
    await page.getByRole('link', { name: 'Mulai Belajar' }).click()
    await expect(page).toHaveURL(/.*session/)

    // Answer flow
    console.log('Answering question...')
    if (await page.getByText('Semua Selesai').isVisible()) {
      throw new Error(
        'E2E Failed: Study session is empty even after creating data. Check progress generation logic.',
      )
    }

    // We expect the question we just added (or another if existing)
    // But since we just added one, it should be available if new questions are included
    await expect(page.getByText('Sesi Belajar')).toBeVisible()
    await page.getByRole('button', { name: 'Tampilkan Jawaban' }).click()

    // Grading
    console.log('Self-grading...')
    await page.getByRole('button', { name: '✅ Benar' }).click()
    await page.getByRole('button', { name: '🟢 Yakin' }).click()
    await page.getByRole('button', { name: 'Lanjut' }).click()

    console.log('Grading completed')

    console.log('--- User Guide E2E Verification Finished Successfully ---')
  })
})
