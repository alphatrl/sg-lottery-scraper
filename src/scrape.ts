import * as Sentry from '@sentry/node';
import dotenv from 'dotenv';
import puppeteer, { Browser } from 'puppeteer';

import singapore from './sources/singapore';
import {
  SingaporeLottery,
  SingaporeLotteryModel,
} from './sources/singapore/model';
import { getJSON } from './utils/networking';
import { writeStore } from './utils/output';

dotenv.config();

const { NODE_ENV, SENTRY_DSN, SERVER_URL } = process.env;

if (SENTRY_DSN) {
  Sentry.init({
    dsn: SENTRY_DSN,
  });
}

const isProduction = NODE_ENV === 'production';
const isTesting = NODE_ENV === 'testing';
const notificationList = [];

async function writeServerFile<T>(fileName: string): Promise<void> {
  const url = `${SERVER_URL}/${fileName}`;
  console.log(`Retrieving ${fileName}.json from ${url}`);
  const list = await getJSON<T>(url).catch((error) => {
    console.error(`[ERROR]: \'${fileName}\` does not exists in server`);
    Sentry?.captureException(error);
    return {};
  });

  Object.keys(list).length > 0
    ? writeStore(fileName, list)
    : console.warn('[WARN]: Skipping file creation');
}

async function processSingapore(browser: Browser) {
  const fileName = 'sg_lottery.json';
  try {
    isProduction || isTesting
      ? await writeServerFile<SingaporeLottery>(`v1/${fileName}`)
      : null;

    const data = await singapore(browser);
    notificationList.push(...data.topics);

    // backwards compatibility with huat-mobile v1
    writeStore<SingaporeLottery>(fileName, data.results, 'upload');

    writeStore<SingaporeLotteryModel>(
      `v1/${fileName}`,
      { upcomingDates: data.upcomingDates, results: data.results },
      'upload'
    );
  } catch (error) {
    console.error(error);
    Sentry?.captureException(error);
  }
}

/**
 * write to a file containing a list of push notifications to send to the server later
 * we dont want to send push notification and have the server serve outdated info
 * in case github workflows take too long
 */
const createTopicsFile = () => {
  const fileName = 'topics.json';
  const scraperTopics = {
    topics: notificationList,
  };
  writeStore(fileName, scraperTopics);
};

const main = async () => {
  console.log(`[INFO]: Current Environment - ${process.env.NODE_ENV}`);
  const isARMMac = process.arch === 'arm64' && process.platform === 'darwin';

  // start puppeteer
  const browser = await puppeteer.launch({
    headless: isProduction || isTesting,
    args: isProduction || isTesting ? ['--no-sandbox'] : [],
    executablePath: isARMMac
      ? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
      : undefined,
  });

  await processSingapore(browser);
  await browser.close();

  createTopicsFile();
};

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    Sentry?.captureException(error);
    process.exit(1);
  });
