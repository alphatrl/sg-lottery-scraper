import dotenv from 'dotenv';
import { ScraperTopics } from './sources/model';

import { default as Firebase } from './utils/firebase';
import { readStore } from './utils/output';

dotenv.config();
const firebase = new Firebase();
const fileName = 'topics.json';

const main = async () => {
  // read details from firebase file
  const firebaseResults = readStore<ScraperTopics>(fileName);
  if (Object.keys(firebaseResults).length === 0) {
    throw 'Firebase Topics File is not found';
  }

  const isSilent = firebaseResults.silent;
  const topics = firebaseResults.topics;
  if (!isSilent && topics.length > 0) {
    console.log('---------- Sending to Firebase ----------');
    for (const i in topics) {
      await firebase.pushTopic(topics[i]);
    }
    console.log('---------- Sending to Firebase [END] ----------');
  }

  await firebase.exit();
};

try {
  main();
} catch (e) {
  console.error(e);
}
