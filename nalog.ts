import * as dotenv from 'dotenv';
dotenv.config({ path: '.env' });

import puppeteer from 'puppeteer';
import { rootUrl } from './constants';
import { logInfo } from './helpers/logger';
import auth from './helpers/auth';
import { navigateToDeclaration } from './helpers/navigate';
import addIncomesArray from './helpers/addIncomeSources';
import exit from './helpers/exit';

import data from './data';

const args = process.argv.slice(2);
const headless = !!args.find((arg) => arg === 'headless');

const launch = async () => {
  try {
    const browser = await puppeteer.launch({ headless });
    logInfo(`LAUNCH BROWSER, HEADLESS = ${headless}`);
    const page = await browser.newPage();
    await page.goto(`${rootUrl}/lkfl/login`);
    await page.setViewport({ width: 1200, height: 720 });

    await auth(page);
    await navigateToDeclaration(page);

    await addIncomesArray(page, data);

    await exit(page); // 2nd arg = true to save changes
    await browser.close();
    logInfo('SUCCESS!');
  } catch (error) {
    logInfo('EXIT WITH ERROR');
    process.exit(1);
  }
};

launch();
