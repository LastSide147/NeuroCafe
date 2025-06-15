const {test, expect} = require ('@playwright/test');

test.beforeEach(async ({ page }) => {     
  // await page.goto('/');
  await page.waitForLoadState('networkidle');
});

test('"Базы Petronics" открывается, наличие элементов, успешная работа поиска', async({ page }) => {
  await page.goto('//lukoil-admin.neuro-city.ru/petronics-bases/');

  const searchField = page.locator('input[type="text"][placeholder="Название базы"]');
  const searchButton = page.locator('button:has-text("Найти")');
  const searchRequest = 'Югнефтепродукт';

   // await expect(searchField).toBeAttached();
  await expect(searchField).toBeVisible();
        
  // await expect(searchButton).toBeAttached();
  await expect(searchButton).toBeVisible();
  await expect(searchButton).toBeEnabled();

  await searchField.fill(searchRequest);
  await expect(searchField).toHaveValue(searchRequest);
  await searchButton.click();

  // Выполнение приостанавливается до появления элемента
  await page.waitForSelector(`article h4:has-text("${searchRequest}")`, { timeout: 3000 });
  await expect(page.locator(`article h4:has-text('${searchRequest}')`)).toBeVisible();
});


test('Строка поиска принимает допустимый ввод', async({ page }) => {
    await page.goto('//lukoil-admin.neuro-city.ru/petronics-bases/');
    const searchField = page.locator('input[type="text"][placeholder="Название базы"]');

    // Строка принимает ТОЛЬКО для кириллицы и дефиса для двойного названия
    const validInput = [
        "Ю", // 1 символ
        "нетфе", // часть слова
        "югнефтепродукт", // полное название, только строчные буквы
        "юго-востокнефтепродукт",  // название через дефис(в кодировке U+002D, ASCII)
        "ЮГНЕФТЕПРОДУКТ", // только заглавные буквы
        "ЮгНеФтЕпРоДуКт", // смешанный регистр
        " югнефтепродукт", // пробел вначале
        "югнефтепродукт ", // пробел в конце
        "юго‐востокнефтепродукт", // дефис в кодировке U+2010, Unicode Hyphen
        "юго–востокнефтепродукт", // дефис в кодировке U+2013, En dash
        "юго—востокнефтепродукт", // дефис в кодировке U+2014, Em dash
        "SouthOilProduct" // латиница
    ];
    for(const input of validInput) {
        await test.step(`${input}`, async () => {
            await searchField.fill(input);
            await expect(searchField).toHaveValue(input);
        });
    }
});

test('Строка поиска не принимает недопустимый ввод', async({ page }) => {
  await page.goto('//lukoil-admin.neuro-city.ru/petronics-bases/');
  const searchField = page.locator('input[type="text"][placeholder="Название базы"]');

  // Строка не должна принимать невалидный ввод
  const invalidInput = [
      '<script>alert("XSS")</script>', // скрипт
      "-",
      "12345",
      "!#@(),.",
      "0",        
      "юго востокнефтепродукт" // название через пробел
    ];
  // for(const input of invalidInput) {
  //   await test.step(`${input}`, async() => {
  //     await searchField.fill(input);
  //     await expect(searchField).not.toHaveValue(input);
  //   });
  // }

  const errors = [];

  for (const input of invalidInput) {
    await test.step(`"${input}"`, async () => {
      await searchField.fill(input);
      try {
        await expect(searchField).not.toHaveValue(input, { timeout: 2000 });
      } catch (e) {
        errors.push(`❌ "${input}"`);
      }
    });
  }

  if (errors.length > 0) {
    throw new Error(`Ошибки при проверке невалидных значений:\n` + errors.join('\n'));
  }

});