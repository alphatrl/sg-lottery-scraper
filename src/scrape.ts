import dotenv from 'dotenv';
import puppeteer, { Browser } from 'puppeteer';

import singapore from './sources/singapore';
import {
  SingaporeLottery,
  SingaporeLotteryModel,
} from './sources/singapore/model';
import { writeStore } from './utils/output';
import { getJSON } from './utils/networking';

dotenv.config();

const isProduction = process.env.NODE_ENV === 'production';
const isTesting = process.env.NODE_ENV === 'testing';
const notificationList = [];

async function writeServerFile<T>(fileName: string): Promise<void> {
  const url = `${process.env.SERVER_URL}/${fileName}`;
  console.log(`Retrieving ${fileName}.json from ${url}`);
  const list = await getJSON<T>(url).catch(() => {
    console.error(`[ERROR]: \'${fileName}\` does not exists in server`);
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
      { results: data.results, upcomingDates: data.upcomingDates },
      'upload'
    );
  } catch (error) {
    console.error(error);
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
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
