import dotenv from 'dotenv';
import fs from 'fs';
import puppeteer from 'puppeteer';
import yargs from 'yargs';

import { singapore } from './scraper';

dotenv.config();

const argv = yargs(process.argv.slice(2)).alias('s', 'silent').argv;
const isProduction = process.env.NODE_ENV === 'production';
const supportedCountries = ['singapore'];
const countries = argv._.length === 0 ? supportedCountries : argv._;
let notificationList = [];

if (!fs.existsSync('temp')) {
  fs.mkdirSync('temp');
}

if (!fs.existsSync('temp/data')) {
  fs.mkdirSync('temp/data');
}

const main = async () => {
  // function to get files from server and store it locally

  // start puppeteer
  const browser = await puppeteer.launch({
    headless: isProduction,
    args: isProduction ? ['--no-sandbox'] : [],
  });

  // loop through input values
  for (const index in countries) {
    switch (countries[index]) {
      case 'singapore':
        notificationList = [...(await singapore(browser))];
        break;
      default:
        console.log(`[WARN]: \`${countries[index]}\` is an invalid argument`);
    }
  }

  await browser.close();
  console.log(notificationList);

  // write to a file containing a list of push notifications to send
  // we dont want to send push notification and have the server serve outdated info
  // in case github workflows take to long
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
