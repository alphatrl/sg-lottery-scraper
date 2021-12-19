import dotenv from 'dotenv';

import { ScraperTopics } from './sources/model';
import { default as Firebase } from './utils/firebase';
import { readStore } from './utils/output';

dotenv.config();

const firebase = new Firebase();
const fileName = 'topics.json';
const isSilent = process.env.SILENT === 'true';

const main = async () => {
  if (isSilent) {
    console.log('SILENT! Not sending Firebase Topics');
    await firebase.exit();
    return;
  }

  // read details from firebase file
  const topicsFile = readStore<ScraperTopics>(fileName);
  const topics = topicsFile?.topics;

  if (!topics) {
    throw `[Firebase]: ${fileName} is not found`;
  }

  if (topics.length > 0) {
    console.log('---------- Sending to Firebase ----------');
    for (const i in topics) {
      await firebase.pushTopic(topics[i]);
    }
    console.log('---------- Sending to Firebase [END] ----------');
  }

  await firebase.exit();
};

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
