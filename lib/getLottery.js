/**
 * @param {import('puppeteer').Browser} browser
 * @param import previousLottery 
 * @param returns Promise(list)
 * 
 * Get fourD, toto, sweep
 * If respective methods returns an empty list, repeat again
 * 
 * Compare with previous lottery result,
 * If results obtain are different, (aka new results are fetched)
 * send push notification via firebase
 */

import fourD from './fourD.js'
import toto from './toto.js'
import sweep from './sweep.js' 
import firebase from './firebase_push.js';

const getLottery = async (browser, lotteryList = {}) => {

  let lottery = await Promise.all([
    getFourD(browser, lotteryList["FourD"]),
    getToto (browser, lotteryList["Toto"]),
    getSweep(browser, lotteryList["Sweep"])
  ]).then((values) => {
    return {
      FourD: values[0],
      Toto: values[1],
      Sweep: values[2]
    }
  }).catch((error) => {
    console.log(error);
    console.log("[ERROR]: Using previous results")
    return lotteryList;
  }).finally(() => firebase.exit());

  return lottery;
}

const getFourD = async (browser, oldFourD = []) => {
  let exit = false;
  let fourDList = [];

  while (!exit) {
    fourDList = await fourD(browser);
    // Is not an empty list
    if (fourDList.length !== 0 ) {
      exit = true;
    }
  }

  // Compare old and new
  if (JSON.stringify(fourDList) !== JSON.stringify(oldFourD)) {
    console.log("[4D]: Fetched new data");
    firebase.pushTopic("4D");
  } else {
    console.log("[4D]: No difference in data");
  }
  return fourDList;
}

const getToto = async (browser, oldToto = []) => {
  let exit = false;
  let totoList = [];

  while (!exit) {
    totoList = await toto(browser);
    // Is not an empty list
    if (totoList.length !== 0 ) {
      exit = true;
    }
  }

  // Compare old and new
  if (JSON.stringify(totoList) !== JSON.stringify(oldToto)) {
    console.log("[TOTO]: Fetched new data");
    firebase.pushTopic("Toto");
  } else {
    console.log("[TOTO]: No difference in data");
  }
  return totoList;
}

const getSweep = async (browser, oldSweep = []) => {
  let exit = false;
  let sweepList = [];

  while (!exit) {
    sweepList = await sweep(browser);
    // Is not an empty list
    if (sweepList.length !== 0 ) {
      exit = true;
    }
  }

  // Compare old and new
  if (JSON.stringify(sweepList) !== JSON.stringify(oldSweep)) {
    console.log("[SWEEP]: Fetched new data");
    firebase.pushTopic("Sweep");
  } else {
    console.log("[SWEEP]: No difference in data");
  }
  return sweepList;
}

export default getLottery;