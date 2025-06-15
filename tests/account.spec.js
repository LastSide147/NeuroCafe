const { test, expect } = require ("@playwright/test")

test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
})

test('Раздел меню "Аккаунт" открывается', async ({ page }) => {
    await page.goto('https://lukoil-admin.neuro-city.ru/accounts');

    await expect(page.getByText('Ваш аккаунт')).toBeVisible();
});

test('Кнопки кликабельны', async ({ page }) => {
    await page.goto('https://lukoil-admin.neuro-city.ru/accounts');


    // await page.waitForSelector('button[name="Найти"]');
    // await expect(page.getByRole('button', {name: 'Найти'})).toBeVisible();
    // await expect(page.getByRole('button', {name: 'Добавить аккаунт'})).toBeVisible();
           await expect(page.getByText('Добавить аккаунт')).toBeVisible();
       

    await expect(page.getByRole('button', {name: 'Добавить аккаунт'})).toBeEnabled();
    await expect(page.getByRole('button', {name: 'Редактировать'})).toBeVisible()
    await expect(page.getByRole('button', {name: 'Редактировать'})).toBeEnabled()
    await expect(page.getByRole('button', {name: 'Выйти'})).toBeVisible()
    await expect(page.getByRole('button', {name: 'Выйти'})).toBeEnabled()
});

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

test('Добавление(статус 201) и удаление аккаунта(статус 200)', async ({ page }) => {
    await page.goto('https://lukoil-admin.neuro-city.ru/accounts');
    
    const userName = "Автотест для Фио";
    const randomIdFromEmail = Math.floor(Math.random() * 100000);

    await(page.getByRole('button', {name: "Добавить аккаунт"})).click();
    await page.locator('input[type="file"]').setInputFiles('C:/Users/zemts/Pictures/UuJegv.jpg') // домашний адрес 
    // await page.locator('input[type="file"]').setInputFiles('C:/Users/Razrab-1509/Desktop/Attach/2.png') // рабочий адрес 
    await expect(page.getByText("Новый аккаунт")).toBeVisible();
    await page.locator('input[placeholder="ФИО"]').pressSequentially(`${userName}`);
    await(page.getByRole('button', {name: 'Выберите должность'})).click();
    await expect(page.getByRole('option', {name: 'Администратор'})).toBeEnabled();
    await expect(page.getByRole('option', {name: 'Менеджер'})).toBeEnabled();
    await expect(page.getByRole('option', {name: 'Руководитель'})).toBeEnabled();
    await expect(page.getByRole('option', {name: 'Зритель'})).toBeEnabled();
    await(page.getByRole('option', {name: 'Администратор'})).click();
    // добавить проверку на созданного пользователя и его роль. Сейчас стабильно создается зритель, потом администратор
    await page.locator('input[placeholder="E-mail"]').pressSequentially(`${randomIdFromEmail}administrator.from.autotest@neuro-city.ru`);
    await page.locator('input[placeholder="●●●●●●"]').pressSequentially('password');
    await page.locator('input[placeholder="Телефон"]').fill('9805000102');

    const responsePromiseCreate = page.waitForResponse(resp =>
    resp.url().includes('/user/create') && resp.request().method() === 'POST'
    );
    await page.getByRole('button', { name: "Сохранить" }).click({ force: true });

    const createResponse = await responsePromiseCreate;

    expect(createResponse.status()).toBe(201);

  // Получаем тело ответа и извлекаем id пользователя
  const responseBody = await createResponse.json();
  const userId = responseBody.id;

  if (!userId) {
    throw new Error('ID пользователя не получен из ответа сервера');
  }
  console.log(`\t\t\tСоздан пользователь с id: ${userId}\n`);

  await page.locator('input[type="text"][placeholder="ФИО сотрудника"]').pressSequentially(`${userName}`);
  await page.getByRole('button', { name: 'Найти' }).click();
  await expect(page.getByText("Автотест")).toBeVisible();
  await page.getByText("Автотест").click();

  // Проверяем доступность кнопок "Удалить" и "Редактировать"
  await expect(page.getByRole('button', { name: "Удалить" })).toBeEnabled();
  await expect(page.getByRole('button', { name: "Редактировать" })).toBeEnabled();

  // Начинаем ждать ответ на удаление *до* клика
  const responsePromiseDelete = page.waitForResponse(resp =>
    resp.url().includes(`/user/${userId}`) && resp.request().method() === 'DELETE' );
  
    await page.getByRole('button', { name: "Удалить" }).click();

  // Ждем ответ удаления
  const deleteResponse = await responsePromiseDelete;

  expect(deleteResponse.status()).toBe(200);
  console.log(`\t\t\tУдален пользователь с id: ${userId}\n`);

  // 5.06.2025 после поиска поле не очищается и после выбора пользователя ввод все равно остается
  
//    await page.locator('input[type="text"][placeholder="ФИО сотрудника"]').pressSequentially(`${userName}`); 
   await page.getByRole('button', { name: 'Найти' }).click();
   await expect(page.getByText("Автотест")).not.toBeVisible();
})

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

test('Редактирование аккаунта (статус 200). БЕЗ ИЗМЕНЕНИЯ НОМЕРА - НЕ ДОБАВЛЯЮТСЯ ПЕРВЫЕ 2 ЦИФРЫ', async ({ page }) => {  // Проблема при редактировании - не меняется должность. При ручнов вводе работет
  await page.goto('https://lukoil-admin.neuro-city.ru/accounts');

    const nameToBeforeChange = "Автотест Имя Один";
    const nameToAfterChange = "Автотест Имя Два"
    const changeNumber = "9807776655";
    const randomIdFromEmail = Math.floor(Math.random() * 100000);

    await(page.getByRole('button', {name: "Добавить аккаунт"})).click();
    await page.locator('input[type="file"]').setInputFiles('C:/Users/zemts/Pictures/UuJegv.jpg') // домашний адрес 
    // await page.locator('input[type="file"]').setInputFiles('C:/Users/Razrab-1509/Desktop/Attach/2.png') // рабочий адрес 
    await expect(page.getByText("Новый аккаунт")).toBeVisible();
    await page.locator('input[placeholder="ФИО"]').pressSequentially(`${nameToBeforeChange}`);
    await(page.getByRole('button', {name: 'Выберите должность'})).click();
    await(page.getByRole('option', {name: 'Администратор'})).click();
    await page.locator('input[placeholder="E-mail"]').pressSequentially(`${randomIdFromEmail}administrator.from.autotest@neuro-city.ru`);
    await page.locator('input[placeholder="●●●●●●"]').pressSequentially('password');
    await page.locator('input[placeholder="Телефон"]').fill('9805000102');

    const responsePromiseCreate = page.waitForResponse(resp =>
    resp.url().includes('/user/create') && resp.request().method() === 'POST');

    await page.getByRole('button', { name: "Сохранить" }).click({ force: true });
    const createResponse = await responsePromiseCreate;
    expect(createResponse.status()).toBe(201);

    const responseBody = await createResponse.json();
    const userID = responseBody.id;

    if (!userID) {
      throw new Error('\t\t\tID пользователя не получен из ответа сервера\n');
    } 
    console.log(`\t\t\tСоздан пользователь с ID: ${userID}\n`);

    await page.locator('input[type="text"][placeholder="ФИО сотрудника"]').pressSequentially(`${nameToBeforeChange}`);
    await page.getByRole('button', { name: 'Найти' }).click();
    await expect(page.getByText("Автотест")).toBeVisible();
    await page.getByText("Автотест").click();

    await page.locator('input[type="text"][placeholder="ФИО сотрудника"]').clear(); //Далее поле ломает работу теста

    await page.getByRole('button', {name: 'Редактировать'}).click();

    await page.screenshot({ path: 'before-click.png' });
    
    // await page.locator('button:has(img[alt="Аватар пользователя"])').waitFor({ state: 'visible', timeout: 30000} );
    await page.locator('button._avatar__button_tpzhe_124').click({ force: true }); // элемент не достаточно надежен. По-другому пока не выходит
    // await page.locator('button:has(img[alt="Аватар пользователя"])').click();
    await page.locator('input[type="file"]').setInputFiles('C:/Users/zemts/Pictures/12.jpg'); // домашний адрес
    await page.locator('input[placeholder = "ФИО"]').clear();
    await page.locator('input[type="text"][placeholder = "ФИО"]').pressSequentially(`${nameToAfterChange}`);
    await(page.locator('div[role="button"][aria-haspopup="listbox"]')).click();
    await(page.getByRole('option', {name: "Менеджер"})).click();
    await page.locator('input[placeholder = "E-mail"]').clear();
    await page.locator('input[placeholder = "E-mail"]').pressSequentially(`${randomIdFromEmail}manager.from.autotest@neuro-city.com`);
    await page.locator('input[placeholder="●●●●●●"]').pressSequentially('NewPassword1956<>');
    // await page.locator('input[placeholder = "Телефон"]').clear();
    // await page.locator('input[placeholder = "Телефон"]').fill('9807777777', {delay: 1000}); // делает ввод 077 77 77
    // await page.locator('input[placeholder = "Телефон"]').fill(`${changeNumber}`); // делает ввод 077 766 55 

    const responsePromisePut = page.waitForResponse(resp => 
      resp.url().includes(`/user/${userID}`) && resp.request().method() === 'PUT');
    await page.getByRole('button', { name: "Сохранить" }).click({ force: true , timeout: 3000});

    const putResonse = await responsePromisePut;
    expect(putResonse.status()).toBe(200);
    console.log(`\t\t\tРедактирован пользователь с id: ${userID}\n`)
    
    await expect(page.getByText(`${nameToAfterChange}`)).toBeVisible();

  const responsePromiseDelete = page.waitForResponse(resp =>
    resp.url().includes(`/user/${userID}`) && resp.request().method() === 'DELETE');
  
  await page.getByRole('button', { name: "Удалить" }).click();

  // Ждем ответ удаления
  const deleteResponse = await responsePromiseDelete;

  expect(deleteResponse.status()).toBe(200);
  console.log(`\t\t\tУдален пользователь с id: ${userID}\n`);
})





// test('Выход из аккаунта по кнопке "Выйти"', async ({ page }) => {
//     await page.goto('https://lukoil-admin.neuro-city.ru/accounts');
    
//     await expect(page.getByRole('button', {name: 'Выйти'})).toBeVisible()
//     await(page.getByRole('button', {name: 'Выйти'})).click();
//     await page.goto('https://keycloak.neuro-city.ru/realms/stage-lukoil-admin/protocol/openid-connect/auth?client_id=admin-panel&redirect_uri=https%3A%2F%2Flukoil-admin.neuro-city.ru%2F&response_type=code&scope=openid&state=15d291e454ad4dadbfbef48906ed5500&code_challenge=eZHvdeqo_dLb4znlH5AAfx9drvqk_5xp7OA3Y3KPrLY&code_challenge_method=S256&response_mode=query'
//         , { waitUntil: 'networkidle' });
// });