import puppeteer from 'puppeteer';
import { rootUrl } from '../constants';
import { logError, logInfo } from './logger';

const auth = async (page: puppeteer.Page) => {
  const successUrl = `${rootUrl}/lkfl/`;
  try {
    const [esiaBtn] = await page.$x('//a[contains(., "Войти через госуслуги (ЕСИА)")]');
    if (!esiaBtn) {
      throw new Error(`esiaBtn not found, esiaBtn value is ${esiaBtn}`);
    }
    esiaBtn.click();
    await page.waitForNavigation({ waitUntil: 'networkidle0' });
    await page.type('#login', process.env.ESIA_LOGIN || '');
    await page.type('#password', process.env.ESIA_PASSWORD || '');
    await page.keyboard.press('Enter');
    await page.waitForNavigation({ waitUntil: 'networkidle0' });
    logInfo('AUTHORIZE');
    await page.waitFor(2000);
    const currentUrl = page.url();
    if (currentUrl !== successUrl) {
      throw new Error(`Error while authorization, current URL is ${currentUrl}`);
    }
  } catch (error) {
    logError(error, 'AUTH ERROR');
    throw new Error(error as string);
  }
};

export default auth;
