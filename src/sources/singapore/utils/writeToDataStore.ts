import fs from 'fs';
import path from 'path';

import { featureFlags } from '../../../constants/featureFlags';
import {
  SG_POOLS_4D_DIR,
  SG_POOLS_DIR,
  SG_POOLS_SWEEP_DIR,
  SG_POOLS_TOTO_DIR,
} from '../constants';
import { FourDModel, SingaporeLottery, SweepModel, TotoModel } from '../model';

function setupStore() {
  if (!fs.existsSync(SG_POOLS_DIR)) {
    console.log('Creating `data/singapore/singaporePools` directory');
    fs.mkdirSync(SG_POOLS_DIR, { recursive: true });
  }

  if (!fs.existsSync(SG_POOLS_4D_DIR)) {
    console.log('Creating `data/singapore/singaporePools/fourD` directory');
    fs.mkdirSync(SG_POOLS_4D_DIR, { recursive: true });
  }

  if (!fs.existsSync(SG_POOLS_TOTO_DIR)) {
    console.log('Creating `data/singapore/singaporePools/toto` directory');
    fs.mkdirSync(SG_POOLS_TOTO_DIR, { recursive: true });
  }

  if (!fs.existsSync(SG_POOLS_SWEEP_DIR)) {
    console.log('Creating `data/singapore/singaporePools/sweep` directory');
    fs.mkdirSync(SG_POOLS_SWEEP_DIR, { recursive: true });
  }
}

function getLotteryType(
  lottery: FourDModel | TotoModel | SweepModel
): 'fourD' | 'toto' | 'sweep' {
  if ('additional' in lottery) {
    return 'toto';
  }
  // SWEEP case
  if ('twoD' in lottery) {
    return 'sweep';
  }
  return 'fourD';
}

function getFilePath(lottery: FourDModel | TotoModel | SweepModel) {
  switch (getLotteryType(lottery)) {
    case 'fourD':
      return path.join(SG_POOLS_4D_DIR, `${lottery.drawNo}.json`);
    case 'toto':
      return path.join(SG_POOLS_TOTO_DIR, `${lottery.drawNo}.json`);
    case 'sweep':
      return path.join(SG_POOLS_SWEEP_DIR, `${lottery.drawNo}.json`);
  }
}

export default function writeToDataStore(lottery: SingaporeLottery) {
  setupStore();

  const fourDList = lottery.FourD;
  const totoList = lottery.Toto;
  const sweepList = lottery.Sweep;

  for (const result of [...fourDList, ...totoList, ...sweepList]) {
    const filePath = getFilePath(result);
    const lotteryType = getLotteryType(result);

    if (fs.existsSync(filePath)) {
      console.info(
        `ℹ️ [${lotteryType}] Draw No. "${result.drawNo}" already exists. Skipping.`
      );
      continue;
    }

    fs.writeFileSync(
      filePath,
      JSON.stringify(result, null, featureFlags.IS_PRODUCTION ? 0 : 2)
    );
  }
}
