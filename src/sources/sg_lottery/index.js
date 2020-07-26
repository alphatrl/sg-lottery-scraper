/**
 * @param {import('puppeteer').Browser} browser
 * @param returns Promise(list)
 * 
 * Get fourD, toto, sweep
 * Return a dict of these objects
 */

import fourD from './fourD.js'
import toto from './toto.js'
import sweep from './sweep.js' 

const getLottery = async (browser) => {

  let lottery = await Promise.all([
    fourD(browser),
    toto(browser),
    sweep(browser),
  ]).then((values) => {
    // convert to dict
    return {
      FourD:     values[0],
      Toto:   values[1],
      Sweep:  values[2],
    }
  }).catch((error) => {
    console.log(error);
    return {};
  })
  return lottery;
}

export default getLottery;