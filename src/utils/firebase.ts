import { default as admin } from 'firebase-admin';

import { FirebaseTopic } from '../sources/model';

/**
 * Class to create push notifications to firebase using firebase topics
 */
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
   * Send push notification via firebase topics
   * @param topic
   */
  async pushTopic(topic: FirebaseTopic): Promise<void> {
    const message = {
      notification: {
        title: topic.title,
        body: topic.body,
      },
      topic: topic.topic,
    };

    await this.app
      .messaging()
      .send(message)
      .then((response) => console.log(`[${topic.topic}]: ${response}]`));
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
