const { chromium } = require('@playwright/test');
const fs = require('fs');

module.exports = async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage();

    await page.goto('https://keycloak.neuro-city.ru/realms/stage-lukoil-admin/protocol/openid-connect/auth?client_id=admin-panel&redirect_uri=https%3A%2F%2Flukoil-admin.neuro-city.ru%2F&response_type=code&scope=openid&state=ed825073b3ab41d498917d2de45756ef&code_challenge=ye3iZ1IRvL20ZE4_12E78iJaztM-eL0K0NTb0WZAjxE&code_challenge_method=S256&response_mode=query');
    await page.fill('input[name = "username"]', 'root');
    await page.fill('input[name = "password"]', 'root');
    await page.locator('input[name = "login"]').click();
    await page.waitForURL('https://lukoil-admin.neuro-city.ru/**', {timeout : 100000});

    // Ожидание стабилизации сетевых запросов
    await page.waitForLoadState('networkidle');

    // Сохранение состояния сессии
    await page.context().storageState( {path : 'auth.json' });
    
    await browser.close();
}
