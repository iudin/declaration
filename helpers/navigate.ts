import puppeteer from 'puppeteer';
import { rootUrl } from '../constants';
import { logError, logInfo } from './logger';

export const navigateToDeclaration = async (page: puppeteer.Page) => {
  const declarationUrl = `${rootUrl}/lkfl/situations/3NDFL?cardId=${process.env.DECLARATION_NUMBER}`;
  try {
    let currentUrl;
    await page.goto(declarationUrl, { waitUntil: 'domcontentloaded' });
    logInfo('NAVIGATED TO DECLARATION');
    await page.waitFor(3000);
    currentUrl = page.url();
    if (currentUrl !== declarationUrl) {
      throw new Error(`
      Error while navigation to declaration page, current URL is ${currentUrl}
      `);
    }

    const nextBtn = await page.$('button[type="submit"]');
    nextBtn?.click();
    await page.waitForNavigation({ waitUntil: 'networkidle0' });
    logInfo('NAVIGATED TO NEXT STEP');

    const foreignIncomesTab = await page.$('#react-tabs-2');
    foreignIncomesTab?.click();
    await page.waitFor(2000);
    logInfo('NAVIGATED TO FOREIGN INCOMES');
  } catch (error) {
    logError(error, 'NAVIGATION ERROR');
    throw new Error(error as string);
  }
};
