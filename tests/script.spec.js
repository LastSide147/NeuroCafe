// const { test, expect } = require("@playwright/test");

// const numberOfRuns = 10; 

// test.beforeEach(async ({ page }) => {
//   await page.goto("/");
//   await page.waitForLoadState("networkidle");
// });

// for (let i = 0; i < numberOfRuns; i++) {
//   test(`Добавление аккаунта. Цикл ${i + 1}`, async ({
//     page,
//   }) => {
//     await page.goto("https://lukoil-admin.neuro-city.ru/accounts");

//     const userName = "Автотест для Фио";
//     const randomIdFromEmail = Math.floor(Math.random() * 100000);

//     await page.getByRole("button", { name: "Добавить аккаунт" }).click();
//     await page
//       .locator('input[type="file"]')
//       .setInputFiles("C:/Users/zemts/Pictures/UuJegv.jpg"); // домашний адрес
//     // await page.locator('input[type="file"]').setInputFiles('C:/Users/Razrab-1509/Desktop/Attach/2.png') // рабочий адрес
//     await expect(page.getByText("Новый аккаунт")).toBeVisible();
//     await page.locator('input[placeholder="ФИО"]').pressSequentially(`${userName}`);
//     await page.getByRole("button", { name: "Выберите должность" }).click();

//     await page.getByRole("option", { name: "Зритель" }).click();
//     await page
//       .locator('input[placeholder="E-mail"]')
//       .pressSequentially(`${randomIdFromEmail}script@neuro-city.ru`);
//     await page
//       .locator('input[placeholder="●●●●●●"]')
//       .pressSequentially("password");
//     await page.locator('input[placeholder="Телефон"]').fill("9805000102");

//     await page.getByRole("button", { name: "Сохранить" }).click({ force: true });
//   });
// }
