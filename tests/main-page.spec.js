// Подключение библиотеки
const {test, expect} = require('@playwright/test');

test.beforeEach(async ({ page }) => {     
      
  // Вход пользователя
   await page.goto('/');

  // Ожидание стабилизации сетевых запросов
  await page.waitForLoadState('networkidle');
  });

test('Меню содержит все элементы', async ({ page }) => {
  await page.goto('https://lukoil-admin.neuro-city.ru/');

  // Меню содержит все элементы
  await expect(page.locator('a[href="/"] >> text=Главная')).toBeVisible();
  await expect(page.locator('a[href="/petronics-bases"] p:has-text("Базы Petronics")')).toBeVisible();
  await expect(page.locator('a[href="/dishes/pending"] p:has-text("Блюда")')).toBeVisible();
  await expect(page.locator('a[href="/categories"] p:has-text("Категории")')).toBeVisible();
  await expect(page.locator('a[href="/menu"] p:has-text("меню")')).toBeVisible();
  await expect(page.locator('a[href="/areals"] p:has-text("Ареалы")')).toBeVisible();
  await expect(page.locator('a[href="/azs/pending"] p:has-text("АЗС")')).toBeVisible();
  await expect(page.locator('a[href="/statistics"] p:has-text("Статистика")')).toBeVisible();
});


test('Изображения со статусом 304', async ({ page }) => {
  const images = [
    'azs-bg.jpg',
    'dishes-bg.jpg',
    'category-bg.jpg',
    'menu-bg.jpg'
  ];
  
  page.on('response', response => {
    const url = response.url();
    for(const nameImages of images) {
      if(url.includes(nameImages)) {
        expect(response.status()).toBe(304);
        //  expect([200, 304]).toContain(status);
      }
    }
  });

  await page.goto('https://lukoil-admin.neuro-city.ru/');
});

test('Изображения загрузились на странице', async ({ page }) => {
  await page.goto('https://lukoil-admin.neuro-city.ru/');

  await expect(await page.locator('img[src*="azs-bg.jpg"]').evaluate(img => img.complete && img.naturalWidth > 0)).toBe(true);
  await expect(await page.locator('img[src*="dishes-bg.jpg"]').evaluate(img => img.complete && img.naturalWidth > 0)).toBe(true);
  await expect(await page.locator('img[src*="category-bg.jpg"]').evaluate(img => img.complete && img.naturalWidth > 0)).toBe(true);
  await expect(await page.locator('img[src*="menu-bg.jpg"]').evaluate(img => img.complete && img.naturalWidth > 0)).toBe(true);
});