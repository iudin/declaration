import puppeteer from 'puppeteer';
import { incomeTypeCode } from '../constants';
import { logError, logInfo } from './logger';

interface IncomeSourceData {
  name: string;
  country?: string;
  currency?: string;
  incomeAmount: string;
  paymentAmount: string;
  date: string;
}

const addIncomeSource = async (page: puppeteer.Page, data: IncomeSourceData) => {
  const ndfl3InputID = 'Ndfl3Package.payload.sheetB.sources';
  const country = data.country || '840';
  const currency = data.currency || '840';
  try {
    const addBtn = await page.$('button[class*="IncomeSources_addButton"]');
    addBtn?.click();
    await page.waitFor(2000);

    const incomeSources = await page.$$('[class*="IncomeSources_incomeSourceSpoiler"]');
    logInfo(`INCOME SOURCES LENGTH: ${incomeSources.length}`);
    const lastItem = incomeSources[incomeSources.length - 1];
    lastItem.click();
    await page.waitFor(2000);

    await page.type(
      `[id="${ndfl3InputID}[${incomeSources.length - 1}].incomeSourceName"]`,
      data.name
    );
    logInfo(`TYPED INCOME SOURCE NAME: ${data.name}`);

    await page.type(`[id="${ndfl3InputID}[${incomeSources.length - 1}].oksmIst"] input`, country);
    await page.keyboard.press('Enter');
    logInfo(`TYPED INCOME SOURCE COUNTRY CODE: ${country}`);

    await page.type(
      `[id="${ndfl3InputID}[${incomeSources.length - 1}].incomeTypeCode"] input`,
      incomeTypeCode
    );
    await page.keyboard.press('Enter');
    logInfo(`TYPED INCOME TYPE CODE: ${incomeTypeCode}`);

    await page.type(
      `[id="${ndfl3InputID}[${incomeSources.length - 1}].incomeAmountCurrency"]`,
      data.incomeAmount
    );
    logInfo(`TYPED INCOME AMOUNT CURRENCY: ${data.incomeAmount}`);

    await page.type(
      `[id="${ndfl3InputID}[${incomeSources.length - 1}].incomeDate"] input`,
      data.date
    );
    await page.keyboard.press('Enter');
    logInfo(`TYPED INCOME DATE: ${data.date}`);

    await page.type(
      `[id="${ndfl3InputID}[${incomeSources.length - 1}].taxPaymentDate"] input`,
      data.date
    );
    await page.keyboard.press('Enter');
    logInfo(`TYPED TAX PAYMENT DATE: ${data.date}`);

    await page.type(
      `[id="${ndfl3InputID}[${incomeSources.length - 1}].currencyCode"] input`,
      currency
    );
    await page.keyboard.press('Enter');
    logInfo(`TYPED INCOME SOURCE CURRENCY CODE: ${currency}`);

    const [getCurrencyCheckbox] = (
      await page.$x('//span[contains(., "Определить курс автоматически")]')
    ).reverse();
    if (!getCurrencyCheckbox) {
      throw new Error(
        `getCurrencyCheckbox not found, getCurrencyCheckbox value is ${getCurrencyCheckbox}`
      );
    }
    getCurrencyCheckbox.click();
    await page.waitFor(1000);

    await page.type(
      `[id="${ndfl3InputID}[${incomeSources.length - 1}].paymentAmountCurrency"]`,
      data.paymentAmount
    );
    logInfo(`TYPED PAYMENT AMOUNT CURRENCY: ${data.paymentAmount}`);
  } catch (error) {
    logError(error, 'ADD INCOME ERROR');
    throw new Error(error as string);
  }
};

const addIncomesArray = async (page: puppeteer.Page, arr: IncomeSourceData[]) => {
  for (const item of arr) {
    await addIncomeSource(page, item);
  }
  logInfo(`DONE! ADDED ${arr.length} INCOME SOURCES`);
};

export default addIncomesArray;
