import dotenv from 'dotenv';
import fs from 'fs';
import puppeteer from 'puppeteer';
import yargs from 'yargs';

import { singapore } from './scraper';
import { getJSON } from './utils/networking';

const argv = yargs(process.argv.slice(2)).alias('s', 'silent').argv;
const isProduction = process.env.NODE_ENV === 'production';
const supportedCountries = ['singapore'];
const countries = argv._.length === 0 ? supportedCountries : argv._;
let notificationList = [];

dotenv.config();

if (!fs.existsSync('temp')) {
  fs.mkdirSync('temp');
}

if (!fs.existsSync('temp/data')) {
  fs.mkdirSync('temp/data');
}

const fetchServerJSON = async (): Promise<void> => {
  const fileNameList = ['sg_lottery'];

  for await (const fileName of fileNameList) {
    const url = `${process.env.SERVER_URL}/${fileName}.json`;
    console.log(`Retrieving ${fileName}.json from ${url}`);

    const list = await getJSON(url).catch(() => {
      console.error(`[ERROR]: \'${fileName}\` does not exists in server`);
      return {};
    });

    // only write to file if information is NOT empty
    Object.keys(list).length > 0
      ? fs.writeFileSync(
          `./temp/data/${fileName}.json`,
          JSON.stringify(list, null, isProduction ? 0 : 2)
        )
      : console.log('[WARN]: Skipping file creation');
  }
};

const main = async () => {
  // function to get files from server and store it locally
  // if development env, the files should be already in local
  console.log(`[INFO]: Current Environment - ${process.env.NODE_ENV}`);
  isProduction ? fetchServerJSON() : null;

  // start puppeteer
  const browser = await puppeteer.launch({
    headless: isProduction,
    args: isProduction ? ['--no-sandbox'] : [],
  });

  // loop through input values
  for await (const country of countries) {
    switch (country) {
      case 'singapore':
        notificationList = [...(await singapore(browser))];
        break;
      default:
        console.log(`[WARN]: \`${country}\` is an invalid argument`);
    }
  }

  await browser.close();

  // write to a file containing a list of push notifications to send to the server later
  // we dont want to send push notification and have the server serve outdated info
  // in case github workflows take too long
  fs.writeFileSync(
    `./temp/topics.json`,
    JSON.stringify(
      {
        silent: argv.s ? true : false,
        topics: notificationList,
      },
      null,
      isProduction ? 0 : 2
    )
  );
};

// main thread
process.on('uncaughtException', function (err) {
  console.log(err);
});
main();
