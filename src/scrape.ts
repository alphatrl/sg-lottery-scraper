import * as Sentry from '@sentry/node';
import dotenv from 'dotenv';
import puppeteer, { Browser } from 'puppeteer';

import { featureFlags } from './constants/featureFlags';
import singapore from './sources/singapore';
import { SG_FILE_NAME } from './sources/singapore/constants';
import {
  SingaporeLottery,
  SingaporeLotteryModel,
} from './sources/singapore/model';
import { getJSON } from './utils/networking';
import { setupStore, writeStore } from './utils/output';

dotenv.config();
setupStore();

const { SENTRY_DSN, SERVER_URL } = process.env;

if (SENTRY_DSN) {
  Sentry.init({
    dsn: SENTRY_DSN,
  });
}

const notificationList = [];

async function writeServerFile<T>(fileName: string): Promise<void> {
  const url = `${SERVER_URL}/${fileName}`;
  console.info(`ℹ️ Retrieving ${fileName}.json from ${url}`);
  const list = await getJSON<T>(url).catch((error) => {
    console.error(`❌ "${fileName}" does not exists on server`);
    Sentry?.captureException(error);
    return {};
  });

  Object.keys(list).length > 0
    ? writeStore({ fileName, data: list })
    : console.warn('ℹ️ Skipping file creation');
}

async function processSingapore(browser: Browser) {
  try {
    if (featureFlags.IS_CI) {
      await writeServerFile<SingaporeLottery>(`v1/${SG_FILE_NAME}`);
    }

    const data = await singapore(browser);
    notificationList.push(...data.topics);
    console.groupEnd();

    // backwards compatibility with huat-mobile v1
    writeStore<SingaporeLottery>({
      fileName: SG_FILE_NAME,
      data: data.results,
      type: 'upload',
    });

    writeStore<SingaporeLotteryModel>({
      fileName: `v1/${SG_FILE_NAME}`,
      data: { upcomingDates: data.upcomingDates, results: data.results },
      type: 'upload',
    });
  } catch (error) {
    console.error(error);
    Sentry?.captureException(error);
  }
}

/**
 * write to a file containing a list of push notifications to send to the server later
 * we don't want to send push notification and have the server serve outdated info
 * in case github workflows take too long
 */
const createTopicsFile = () => {
  const fileName = 'topics.json';
  const scraperTopics = {
    topics: notificationList,
  };
  writeStore({ fileName, data: scraperTopics });
};

const main = async () => {
  console.info(`ℹ️ Current Environment - ${process.env.NODE_ENV}`);

  // start puppeteer
  const browser = await puppeteer.launch({
    headless: featureFlags.IS_CI,
    args: featureFlags.IS_CI ? ['--no-sandbox'] : [],
  });

  console.group('🇸🇬 Singapore');
  await processSingapore(browser);
  console.groupEnd();

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
