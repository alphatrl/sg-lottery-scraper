/**
 * Push notifications to firebase
 * Using firebase topics
 */

import { default as admin } from 'firebase-admin';

// convert to basic_human understanding
const DICT_KEY = {
  FourD: '4D',
  Toto: 'Toto',
  Sweep: 'Sweep',
}

export default class Firebase {
  app: admin.app.App;

  constructor() {
    this.app = admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      }),
      databaseURL: process.env.FIREBASE_DATABASE_URL,
    });
  }

  /**
   * @param import List: {KEY: Boolean}
   *
   * Send push notifications via firebase
   * If there TRUE, send a push notification to firebase using
   * the topic KEY
   */
  async pushTopicWithList(list): Promise<void> {
    for (const key in list) {
      const topic = key;

      // If true
      if (list[key]) {
        const message = {
          notification: {
            title: DICT_KEY[key] + ' Results',
            body: 'See the latest results',
          },
          topic: topic,
        };

        await this.app
          .messaging()
          .send(message)
          .then((response) => console.log(`[${topic}]: ${response}]`));
      }
    }
  }

  /**
   * @param import List: {KEY: Boolean}
   *
   * Send push notifications via firebase
   * If there TRUE, send a push notification to firebase using
   * the topic KEY
   *
   * FOR DEV ENVIRONMENT ONLY!
   */
  async pushTestTopicWithList(list): Promise<void> {
    for (const key in list) {
      const topic = key + '-Test';

      // If true
      const message = {
        notification: {
          title: DICT_KEY[key] + ' Results',
          body: 'See the latest results',
        },
        topic: topic,
      };

      await this.app
        .messaging()
        .send(message)
        .then((response) => console.log(`[${topic}]: ${response}]`));
    }
  }

  /**
   * Delete firebase connection
   */
  async exit(): Promise<void> {
    this.app
      .delete()
      .then(() => console.log('[Firebase]: Terminated sucessfully'))
      .catch((error) => console.log('[Firebase Error]:', error));
  }
}
