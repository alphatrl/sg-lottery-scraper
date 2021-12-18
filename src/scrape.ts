import dotenv from 'dotenv';
import puppeteer, { Browser } from 'puppeteer';

import singapore, { singaporeUpcomingDates } from './sources/singapore';
import {
  SingaporeLottery,
  SingaporeUpcomingDatesModel,
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
  const fileNameResults = 'sg_lottery.json';
  const fileNameDates = 'sg_upcoming_dates.json';
  try {
    isProduction || isTesting
      ? await writeServerFile<SingaporeLottery>(fileNameResults)
      : null;

    const upcomingDates = await singaporeUpcomingDates(browser);
    const singaporeResults = await singapore(browser);
    notificationList.push(...singaporeResults.topics);

    writeStore<SingaporeLottery>(
      fileNameResults,
      singaporeResults.results,
      'upload'
    );
    writeStore<SingaporeUpcomingDatesModel>(
      fileNameDates,
      upcomingDates,
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
