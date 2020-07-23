/**
 * @param import Topic Key 
 * 
 * Send push notifications via firebase
**/

import {default as admin} from 'firebase-admin';
import util from 'util';

const topics_dict = {
  "4D": "fourD",
  "Toto": "toto",
  "Sweep": "sweep",
}
class Firebase {
  
  constructor(){
    this.app = admin.initializeApp({
      credential: admin.credential.cert({
        "project_id": process.env.FIREBASE_PROJECT_ID,
        "private_key": process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        "client_email": process.env.FIREBASE_CLIENT_EMAIL,
      }),
      databaseURL: process.env.FIREBASE_DATABASE_URL
    });
  }

  pushTopic(id) {
    let topics = topics_dict[id];

    if (process.env.NODE_ENV !== 'production') {
      topics += "-test";
    }

    const message = {
      notification: {
        title: id + " Results",
        body: "See the latest results",
      },
      topic: topics
    };

    this.app
      .messaging()
      .send(message)
      .then(response => {
        console.log(util.format('[%s]: %s', id, response));
      })
  }

  pushTestTopic(id) {

    if (process.env.NODE_ENV !== 'production') {
      let topics = topics_dict[id] + "-test";

      const message = {
        notification: {
          title: id + " Results",
          body: "See the latest results",
        },
        topic: topics
      };
  
      this.app
        .messaging()
        .send(message)
        .then(response => {
          console.log(util.format('[%s]: %s', id, response));
        })

    }
  }

  exit(){
    this.app.delete()
      .then(() => console.log("[Firebase]: Terminated sucessfully"))
      .catch((error) => console.log("[Firebase Error]:", error));
  }
}

const FirebaseSingleton = new Firebase();
Object.freeze(FirebaseSingleton);
export default FirebaseSingleton;