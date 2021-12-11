import dotenv from 'dotenv';
import fs from 'fs';
import puppeteer, { Browser } from 'puppeteer';

import singapore from './sources/singapore';
import { SingaporeLottery } from './sources/singapore/model';
import { writeStore } from './utils/output';
// import { getJSON } from './utils/networking';

dotenv.config();

const isProduction = process.env.NODE_ENV === 'production';
const isTesting = process.env.NODE_ENV === 'testing';
const isSilent = process.env.SILENT === 'true';
const notificationList = [];

// const fetchServerJSON = async (): Promise<void> => {
//   const fileNameList = ['sg_lottery'];

//   for await (const fileName of fileNameList) {
//     const url = `${process.env.SERVER_URL}/${fileName}.json`;
//     console.log(`Retrieving ${fileName}.json from ${url}`);

//     const list = await getJSON<SingaporeLottery>(url).catch(() => {
//       console.error(`[ERROR]: \'${fileName}\` does not exists in server`);
//       return {};
//     });

//     // only write to file if information is NOT empty
//     Object.keys(list).length > 0
//       ? fs.writeFileSync(
//           `./temp/data/${fileName}.json`,
//           JSON.stringify(list, null, isProduction ? 0 : 2)
//         )
//       : console.log('[WARN]: Skipping file creation');
//   }
// };

const processSingapore = async (browser: Browser) => {
  const fileName = 'sg_lottery';
  try {
    const singaporeResults = await singapore(browser);
    notificationList.push(...singaporeResults.topics);
    writeStore<SingaporeLottery>(fileName, singaporeResults.results, 'upload');
  } catch (error) {
    console.error(error);
  }
};

const main = async () => {
  // function to get files from server and store it locally
  // if development env, the files should be already in local
  console.log(`[INFO]: Current Environment - ${process.env.NODE_ENV}`);
  const isARMMac = process.arch === 'arm64' && process.platform === 'darwin';
  // isProduction ? fetchServerJSON() : null;

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

  // write to a file containing a list of push notifications to send to the server later
  // we dont want to send push notification and have the server serve outdated info
  // in case github workflows take too long
  fs.writeFileSync(
    `./temp/topics.json`,
    JSON.stringify(
      {
        silent: isSilent,
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
