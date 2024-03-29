import { Browser } from 'puppeteer';

import getListKeyDifference from '../../utils/compareList';
import { readStore } from '../../utils/output';
import { FirebaseTopic } from '../model';
import FourD from './fourD';
import {
  SingaporeLottery,
  SingaporeLotteryAndTopics,
  SingaporeLotteryModel,
} from './model';
import Sweep from './sweep';
import Toto from './toto';
import { default as singaporeUpcomingDates } from './upcomingDates';

const isProduction = process.env.NODE_ENV === 'production';
const fileName = 'sg_lottery.json';

const DICT_KEY = {
  FourD: '4D',
  Toto: 'Toto',
  Sweep: 'Sweep',
};

const getLottery = async (browser: Browser): Promise<SingaporeLottery> => {
  let fourD = [];
  let toto = [];
  let sweep = [];

  while (
    Object.keys(fourD).length === 0 ||
    Object.keys(toto).length === 0 ||
    Object.keys(sweep).length === 0
  ) {
    [fourD, toto, sweep] = await Promise.all([
      await FourD(browser),
      await Toto(browser),
      await Sweep(browser),
    ]);
  }

  return {
    FourD: fourD,
    Toto: toto,
    Sweep: sweep,
  };
};

const prepareTopic = (topics: string[]): FirebaseTopic[] => {
  const topicList = [];

  for (const key of topics) {
    if (key in DICT_KEY) {
      topicList.push({
        topic: isProduction ? key : `${key}-Test`,
        title: `${DICT_KEY[key]} Results`,
        body: 'See the latest results',
      });
    }
  }
  return topicList;
};

export default async function singapore(
  browser: Browser
): Promise<SingaporeLotteryAndTopics> {
  console.log('---------- Singapore ----------');
  const upcomingDates = await singaporeUpcomingDates(browser);
  const prevList = readStore<SingaporeLotteryModel>(`v1/${fileName}`);
  const lottery = await getLottery(browser);
  const difference = getListKeyDifference<SingaporeLottery>(
    lottery,
    prevList?.results || {}
  );
  const topicList = prepareTopic(difference);
  console.log('---------- Singapore [Fin] ----------');

  return {
    results: lottery,
    upcomingDates: upcomingDates,
    topics: topicList,
  };
}
