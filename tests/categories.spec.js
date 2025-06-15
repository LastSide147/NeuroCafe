const{ test, expect } = require ('@playwright/test')

test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
});

test('Раздел "Категории" открывается', async({ page}) => {
    await page.goto('//lukoil-admin.neuro-city.ru/categories/');  
});


test('Поиск в разделе "Категории" успешно отрабатывает', async ({ page }) => {
    await page.goto('//lukoil-admin.neuro-city.ru/categories/');  
    
    const searchField = page.locator('input[type="text"][placeholder="Название категории"]');
    const searchButton = page.locator('button:has-text("Найти")');
    const searchRequest = 'test20';

    await expect(searchField).toBeVisible();
    await expect(searchField).toBeEnabled();

    await expect(searchButton).toBeVisible();
    await expect(searchButton).toBeEnabled();

    await searchField.fill(searchRequest);
    await expect(searchField).toHaveValue(searchRequest);
    await searchButton.click();

    await page.waitForSelector(`article h4:has-text('${searchRequest}')`, {timeout: 3000});
    await expect(page.locator(`article h4:has-text('${searchRequest}')`)).toBeVisible();

    await expect(page.getByText('Добавить категорию')).toBeVisible();
    await page.getByText('Добавить категорию').click();
});

test('Кнопка "Добавить категорию" - открывает страницу с элементами для создания и кнопкой "Назад"', async ({ page }) => {
    await page.goto('https://lukoil-admin.neuro-city.ru/categories/');
    await page.getByText('Добавить категорию').click();
    
    const buttonBack = page.getByRole('button', { name: 'Назад' });

    await expect(buttonBack).toBeVisible();
    await expect(buttonBack).toBeEnabled();
    await expect(page.getByText('Новая категория')).toBeVisible();
    await expect(page.getByText('Название категории')).toBeVisible();
    await expect(page.locator('input[type="text"][placeholder="Название категории"]')).toBeVisible();
    await expect(page.locator('input[type="text"][placeholder="Название категории"]')).toBeEnabled();
    await expect(page.getByText('Добавить иконку')).toBeVisible(); // !!! "иконку" не соотоветсвует дизайну и текст будет изменен 
    await expect(page.getByRole('button', { name: 'Выбрать из существующих' })).toBeVisible();
    await page.getByRole('button', { name: 'Выбрать из существующих' }).click();
    await expect(page.getByRole('button', { name: 'Загрузить с компьютера'})).toBeVisible();
    await page.getByRole('button', { name: 'Загрузить с компьютера' }).click();
    await expect(page.locator('#card-input')).toBeEnabled();
    await expect(page.getByRole('button', {name: 'Отменить'})).toBeVisible();
    await expect(page.getByRole('button', {name: 'Отменить'})).toBeEnabled();
    await expect(page.getByRole('button', {name: 'Создать'})).toBeVisible();
    await expect(page.getByRole('button', {name: 'Создать'})).toBeEnabled();
    // await page.getByText('Загрузите иконку').click(); // нажимает на кнопку по label
});

test('Кнопка "Назад" открывает раздел категории', async ({ page }) => {
    await page.goto('https://lukoil-admin.neuro-city.ru/categories/');
    await page.getByText('Добавить категорию').click();
    await page.getByRole('button', { name: 'Назад' }).click();
    await expect(page.getByText('Добавить категорию')).toBeVisible();
});

test('Ктегорию можно создать и удалить', async ({ page }) => {
    await page.goto('https://lukoil-admin.neuro-city.ru/categories/');

    const nameCategory = 'ТестоваЯ';

    await page.getByText('Добавить категорию').click();
    await page.locator('input[type="text"][placeholder="Название категории"]').fill(nameCategory);
    await page.getByRole('button', { name: 'Выбрать из существующих' }).click();
    await page.click('text=Выбрать иконку').click;
    await page.click(`article._card_ggn7h_94 img[src="https://lukoil-admin-back.neuro-city.ru/image/9a91a7c7-a286-4cc6-b862-99fda3daf8d0.png"]`);
    await(page.getByRole('button', {name: "Далее"})).click();
    await(page.getByRole('button', {name: "Сохранить"})).click();
    await(page.locator(`h4._title_ggn7h_15:has-text("${nameCategory}")`)).click();
    await expect(page.getByText(`${nameCategory}`)).toBeVisible();
    await expect(page.getByRole('button', { name: "Редактировать" })).toBeVisible();
    await expect(page.getByRole('button', { name: "Удалить" })).toBeVisible();
    await page.getByRole('button', { name: "Удалить" }).click();
    await expect(page.getByText('Добавить категорию')).toBeVisible();
    await expect(page.locator(`text=${nameCategory}`)).not.toBeVisible();
});

test("Поле с названием категории принимает допустимый ввод", async ({ page}) => {
    await page.goto('https://lukoil-admin.neuro-city.ru/categories/')

    const nameCategory = page.locator('input[type="text"][placeholder="Название категории"]');

    const validInput = [
        "Десерты",
        "Горячие обеды",
        "десерты",
        "ДЕСЕРТЫ",
        "ДеСеРтЫ",
        "Breakfast",
        " Десерты",
        "Десерты "
    ];
    for(const input of validInput) {
        await test.step(`${input}`, async() => {
            await nameCategory.fill(input);
            await expect(nameCategory).toHaveValue(input);
        });
    }
});


test("Поле с названием категории не принимает недопустимый ввод", async ({ page}) => {
    await page.goto('https://lukoil-admin.neuro-city.ru/categories/')

    const nameCategory = page.locator('input[type="text"][placeholder="Название категории"]');

    const invalidInput = [
        "0",
        "      ", // Не найдено решения заполнения поля только пробелами. Почему-то после вставки они сбрасываются
        "!$}{%&",
        "666",
        '<script>alert("XSS")</script>',
        "🙉🙊🙈",
        "Несколько слов через пробел"
    ]

    const errors = [];

  for (const input of invalidInput) {
    await test.step(`"${input}"`, async () => {
      await nameCategory.fill(input);
      try {
        await expect(nameCategory).not.toHaveValue(input, { timeout: 2000 });
      } catch (e) {
        errors.push(`FAIL: "${input}"`);
      }
    });
  }

  if (errors.length > 0) {
    throw new Error(`Ошибки при проверке невалидных значений:\n` + errors.join('\n'));
  }
});