import dotenv from 'dotenv';
import path from 'path';

import { default as Firebase } from './firebase';
import { getJSONLocal } from './networking';

dotenv.config();
const firebase = new Firebase();
const url = `${path.resolve()}/temp/topics.json`;

const main = async () => {
  // read details from firebase file
  await getJSONLocal(url)
    .then(
      async (list: {
        silent: string;
        topics: { topic: string; title: string; body: string }[];
      }) => {
        const isSilent = list.silent;
        const topics = list.topics;

        // if arg silent is not provided and changes are detected
        // send topics to Firebase
        if (!isSilent && topics.length > 0) {
          console.log('---------- Sending to Firebase ----------');
          for (const i in topics) {
            await firebase.pushTopic(topics[i]);
          }
          console.log('---------- Sending to Firebase [END] ----------');
        }
      }
    )
    .catch(() => console.error('[ERROR] Firebase topics file not found'))
    .finally(async () => await firebase.exit());
};

main();
