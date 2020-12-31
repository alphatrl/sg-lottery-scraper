import { spawnSync } from 'child_process';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import puppeteer, { Browser } from 'puppeteer';

dotenv.config();

import { FourD, Sweep, Toto } from '../sources/sg_lottery';
import { default as verifyList } from '../utils/compareList';
import { default as Firebase } from '../utils/firebase';
import { getJSON, getJSONLocal } from '../utils/networking';

const isProduction = process.env.NODE_ENV === 'production';
const firebase = new Firebase();
const fileName = 'sg_lottery';
const url = isProduction
  ? `https://alphatrl.github.io/sg-lottery-scraper/${fileName}.json`
  : `${path.resolve()}/temp/${fileName}.json}`;

if (!fs.existsSync('temp')) {
  fs.mkdirSync('temp');
}

const getLottery = async (browser: Browser) => {
  let fourD = [];
  let toto = [];
  let sweep = [];

  while (
    Object.keys(fourD).length === 0 ||
    Object.keys(toto).length === 0 ||
    Object.keys(sweep).length === 0
  ) {
    fourD = await FourD(browser);
    toto = await Toto(browser);
    sweep = await Sweep(browser);
  }

  return {
    FourD: fourD,
    Toto: toto,
    Sweep: sweep,
  };
};

const main = async () => {
  const browser = await puppeteer.launch({
    headless: isProduction,
    args: isProduction ? ['--no-sandbox'] : [],
  });
  const prevList = isProduction ? await getJSON(url) : await getJSONLocal(url);
  const lottery = await getLottery(browser);

  console.log(prevList);

  await browser.close();
};

main();
