import puppeteer from 'puppeteer';
import { logError, logInfo, logWarning } from './logger';

const exit = async (page: puppeteer.Page, saveChanges = false) => {
  try {
    const [exitDeclarationBtn] = await page.$x('//button[contains(., "Выйти")]');
    if (!exitDeclarationBtn) {
      throw new Error(`exitBtn not found, exitBtn value is ${exitDeclarationBtn}`);
    }
    exitDeclarationBtn.click();

    const modalBtnSelector = `button[value="${saveChanges ? 'Да' : 'Нет'}"]`;
    await page.waitForSelector(modalBtnSelector);

    const saveChangesBtn = await page.$(modalBtnSelector);
    saveChangesBtn?.click();
    await page.waitForNavigation({ waitUntil: 'networkidle0' });
    logInfo(
      saveChanges ? 'DECLARATION SUCCESSFULLY SAVED' : 'EXITED FROM DECLARATION WITHOUT SAVING'
    );
    await page.waitFor(1000);

    const lkMenuBtn = await page.$('[class*="HeaderMenu_toggle"]');
    lkMenuBtn?.click();
    logWarning(`Menu button node: ${lkMenuBtn}`);
    logInfo('MENU CLICK');

    const exitLKBtnSelector = 'a[title="Выход"]';
    await page.waitForSelector(exitLKBtnSelector);
    const exitLKBtn = await page.$(exitLKBtnSelector);
    exitLKBtn?.click();
    logWarning(`Exit button node: ${exitLKBtn}`);
    logInfo('EXIT CLICK');
    await page.waitForNavigation({ waitUntil: 'networkidle0' });
  } catch (error) {
    logError(error, 'EXIT ERROR');
    throw new Error(error as string);
  }
};

export default exit;
