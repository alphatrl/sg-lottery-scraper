import { Browser } from 'puppeteer';

import getListKeyDifference from '../../utils/compareList';
import { featureFlags } from '../../utils/featureFlags';
import { readStore } from '../../utils/output';
import { FirebaseTopic } from '../model';
import { SG_FILE_NAME } from './constants';
import FourD from './fourD';
import {
  SingaporeLottery,
  SingaporeLotteryAndTopics,
  SingaporeLotteryModel,
} from './model';
import Sweep from './sweep';
import Toto from './toto';
import { default as singaporeUpcomingDates } from './upcomingDates';
import writeToDataStore from './utils/writeToDataStore';

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
      FourD(browser),
      Toto(browser),
      Sweep(browser),
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
        topic: featureFlags.IS_PRODUCTION ? key : `${key}-Test`,
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
  const prevList = readStore<SingaporeLotteryModel>({
    fileName: `v1/${SG_FILE_NAME}`,
  });
  const lottery = await getLottery(browser);
  writeToDataStore(lottery);

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
