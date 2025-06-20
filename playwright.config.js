const { defineConfig, devices } = require('@playwright/test');
import path from 'path';

export default defineConfig({
  testDir: './tests',
  timeout: 30000,
  retries: 1, // Повторная попытка при падении
  use: {
    headless: true,
    viewport: { width: 1280, height: 720 },
    baseURL: 'https://lukoil-admin.neuro-city.ru',
    storageState: 'auth.json',

    trace: 'on',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  globalSetup: './global-setup.js',

  reporter: [
    ['list', { printSteps: true }],
    ['html', { open: 'always' }],
  ],

  projects: [
    { name: 'Chromium', use: { ...devices['Desktop Chrome'] }, },

    // 20.06.2025 пока не ясно, что нужно
    
    // { name: 'Firefox', use: { ...devices['Desktop Firefox'] }, },
    // { name: 'WebKit', use: { ...devices['Desktop Safari'] }, },
    // { name: 'Yandex',
    //   use: {
    //     channel: undefined, // обязательно, чтобы Playwright не подменял бинарник
    //     browserName: 'chromium',
    //     executablePath: 'D:\\Download\\Castle Frank\\AppData\\Local\\Yandex\\YandexBrowser\\Application\\browser.exe', //домашний ПК
    //     headless: false,
    //   },
    // }
  ],
});
