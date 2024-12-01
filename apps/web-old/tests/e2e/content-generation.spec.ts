import { test, expect } from '@playwright/test'

test.describe('Content Generation Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Go to the content generation page
    await page.goto('/content')
    
    // Ensure we're logged in (implement your auth logic here)
    // await login(page)
  })

  test('generates image content successfully', async ({ page }) => {
    // Fill in the content form
    await page.fill('[aria-label="Content prompt"]', 'A beautiful sunset')
    await page.selectOption('[aria-label="Content type"]', 'image')
    
    // Configure image settings
    await page.click('button:text("Advanced Settings")')
    await page.selectOption('[aria-label="Model"]', 'flux_pro')
    await page.selectOption('[aria-label="Image size"]', '512x512')
    
    // Generate content
    await page.click('button:text("Generate")')
    
    // Wait for generation to complete
    await expect(page.locator('.generation-status')).toContainText('Complete')
    
    // Verify image is displayed
    const image = page.locator('.generated-image')
    await expect(image).toBeVisible()
    
    // Verify download button is available
    await expect(page.locator('button:text("Download")')).toBeEnabled()
  })

  test('generates audio content successfully', async ({ page }) => {
    // Fill in the content form
    await page.fill('[aria-label="Content prompt"]', 'Welcome message')
    await page.selectOption('[aria-label="Content type"]', 'audio')
    
    // Configure audio settings
    await page.click('button:text("Advanced Settings")')
    await page.selectOption('[aria-label="Voice model"]', 'f5_tts')
    
    // Generate content
    await page.click('button:text("Generate")')
    
    // Wait for generation to complete
    await expect(page.locator('.generation-status')).toContainText('Complete')
    
    // Verify audio player is displayed
    const audioPlayer = page.locator('audio')
    await expect(audioPlayer).toBeVisible()
    
    // Verify audio controls work
    await page.click('button:text("Play")')
    await expect(page.locator('.audio-status')).toContainText('Playing')
  })

  test('handles generation errors gracefully', async ({ page }) => {
    // Trigger an error condition (e.g., empty prompt)
    await page.click('button:text("Generate")')
    
    // Verify error message is displayed
    await expect(page.locator('.error-message'))
      .toContainText('Please enter a prompt')
    
    // Verify form can be resubmitted
    await page.fill('[aria-label="Content prompt"]', 'Valid prompt')
    await page.click('button:text("Generate")')
    await expect(page.locator('.error-message')).not.toBeVisible()
  })

  test('saves generated content', async ({ page }) => {
    // Generate content
    await page.fill('[aria-label="Content prompt"]', 'Test content')
    await page.click('button:text("Generate")')
    await expect(page.locator('.generation-status')).toContainText('Complete')
    
    // Save content
    await page.click('button:text("Save")')
    
    // Verify save confirmation
    await expect(page.locator('.save-status')).toContainText('Saved')
    
    // Verify content appears in saved items
    await page.click('a:text("Saved Content")')
    await expect(page.locator('.saved-item')).toContainText('Test content')
  })

  test('batch generation works correctly', async ({ page }) => {
    // Add multiple prompts
    await page.click('button:text("Add Prompt")')
    await page.fill('[aria-label="Content prompt 1"]', 'First prompt')
    await page.fill('[aria-label="Content prompt 2"]', 'Second prompt')
    
    // Start batch generation
    await page.click('button:text("Generate All")')
    
    // Wait for all generations to complete
    await expect(page.locator('.batch-status')).toContainText('Complete')
    
    // Verify all content is generated
    const generatedItems = page.locator('.generated-item')
    await expect(generatedItems).toHaveCount(2)
  })

  test('content preview and editing works', async ({ page }) => {
    // Generate initial content
    await page.fill('[aria-label="Content prompt"]', 'Initial content')
    await page.click('button:text("Generate")')
    await expect(page.locator('.generation-status')).toContainText('Complete')
    
    // Edit settings and regenerate
    await page.click('button:text("Edit")')
    await page.fill('[aria-label="Content prompt"]', 'Modified content')
    await page.click('button:text("Regenerate")')
    
    // Verify new content is generated
    await expect(page.locator('.generation-status')).toContainText('Complete')
    await expect(page.locator('.content-preview')).toContainText('Modified')
  })
})
